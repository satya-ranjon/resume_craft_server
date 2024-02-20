import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middlewares/error";
import {
  checkActiveToken,
  createActivationToken,
} from "../services/auth.services";
import ErrorHandler from "../utils/errorHandler";
import userModel from "../models/user.model";
import sendMail from "../utils/sendMail";
import { accessTokenOption, refreshTokenOption, sendToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import jwt from "jsonwebtoken";

interface IUserRegister {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const userRegister = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      if (!email || !password || !name) {
        return next(
          new ErrorHandler(
            "Please enter your email and password or name !",
            400
          )
        );
      }
      const isEmailExist = await userModel.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email already exist !", 400));
      }

      const user: IUserRegister = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { name, activationCode };

      // Send Activation mail
      try {
        await sendMail({
          email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${email} to active your account.`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IUserActivation {
  activateToken: string;
  activateCode: string;
}

export const userActivation = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activateToken, activateCode } = req.body as IUserActivation;

      const { isToken, user } = checkActiveToken(activateToken, activateCode);

      if (!isToken) {
        return next(new ErrorHandler("Invalid activation code !", 400));
      }

      const { name, email, password } = user;

      const existUser = await userModel.findOne({ email });

      if (existUser as any) {
        return next(new ErrorHandler("Email already exist !", 400));
      }
      const newUser = await userModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
        user: { name: newUser.name, email: newUser.email },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IUserLogin {
  email: string;
  password: string;
}

export const userLogin = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as IUserLogin;

      if (!email || !password) {
        return next(
          new ErrorHandler("Please enter your email and password !", 400)
        );
      }
      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password !", 400));
      }
      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const userGoogleLogin = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body;

      if (!email && !name) {
        return next(new ErrorHandler("Please enter your email and name", 400));
      }

      const user = await userModel.findOneAndUpdate(
        { email: email },
        { name, email, avatar: { url: avatar, public_id: "" } },
        { new: true, upsert: true }
      );

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// logout user
export const userLogout = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      await redis.del(req.user?._id);

      res.status(200).json({
        success: true,
        message: "Logout successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update access token
export const updateAccessToken = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as JwtPayload;

      if (!decoded) {
        return next(new ErrorHandler("Could not find refresh token", 400));
      }
      const session = await redis.get(decoded.id as string);
      if (!session) {
        return next(new ErrorHandler("Could not find refresh token", 400));
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET || "",
        {
          expiresIn: "5m",
        }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET || "",
        {
          expiresIn: "3d",
        }
      );

      res.cookie("access_token", accessToken, accessTokenOption);
      res.cookie("refresh_token", refreshToken, refreshTokenOption);

      res.status(200).json({
        success: true,
        user,
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
