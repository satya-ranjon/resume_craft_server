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
import bcrypt from "bcrypt";

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
      const timeLimiteDifference = Date.now() - user.plan.checkoutDate;
      const IsdaysDifferenceTrue =
        Math.floor(timeLimiteDifference / (1000 * 60 * 60 * 24)) >
        user.plan.timeLimite;

      const IsAfterThertyDay =
        Math.floor(timeLimiteDifference / (1000 * 60 * 60 * 24)) > 30;

      const isFreeType = user.plan.type === "free";

      const isNotFreeType =
        user.plan.type !== "free" &&
        IsAfterThertyDay &&
        user.plan.downloadlimite === 0;

      const newDataPlan = {
        type:
          IsdaysDifferenceTrue && isFreeType
            ? "free"
            : isNotFreeType
            ? "free"
            : user.plan.type,
        downloadlimite:
          IsdaysDifferenceTrue && isFreeType
            ? 10
            : isNotFreeType
            ? 10
            : user.plan.downloadlimite,
        timeLimite:
          IsdaysDifferenceTrue && isFreeType
            ? 30
            : isNotFreeType
            ? 30
            : user.plan.timeLimite,
        checkoutDate:
          IsdaysDifferenceTrue && isFreeType
            ? Date.now()
            : isNotFreeType
            ? Date.now()
            : user.plan.checkoutDate,
      };

      user.plan = newDataPlan;
      await user.save();

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
        {
          name,
          email,
          avatar: { url: avatar, public_id: "" },
          socialLogin: true,
        },
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

      const timeLimiteDifference = Date.now() - user.plan.checkoutDate;

      const IsdaysDifferenceTrue =
        Math.floor(timeLimiteDifference / (1000 * 60 * 60 * 24)) >
        user.plan.timeLimite;

      const IsAfterThertyDay =
        Math.floor(timeLimiteDifference / (1000 * 60 * 60 * 24)) > 30;

      const isFreeType = user.plan.type === "free";

      const isNotFreeType =
        user.plan.type !== "free" &&
        IsAfterThertyDay &&
        user.plan.downloadlimite === 0;

      const newDataPlan = {
        type:
          IsdaysDifferenceTrue && isFreeType
            ? "free"
            : isNotFreeType
            ? "free"
            : user.plan.type,
        downloadlimite:
          IsdaysDifferenceTrue && isFreeType
            ? 10
            : isNotFreeType
            ? 10
            : user.plan.downloadlimite,
        timeLimite:
          IsdaysDifferenceTrue && isFreeType
            ? 30
            : isNotFreeType
            ? 30
            : user.plan.timeLimite,
        checkoutDate:
          IsdaysDifferenceTrue && isFreeType
            ? Date.now()
            : isNotFreeType
            ? Date.now()
            : user.plan.checkoutDate,
      };

      if (IsdaysDifferenceTrue || isNotFreeType) {
        const updateUser = await userModel.findOneAndUpdate(
          { _id: user._id },
          {
            ...user,
            plan: newDataPlan,
          },
          { new: true, upsert: true }
        );
        await redis.set(user._id, JSON.stringify(updateUser) as any);
      }

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

export const userForgetPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (!email) {
        return next(new ErrorHandler("Please enter your email!", 400));
      }

      const user = await userModel.findOne({
        email: email,
        socialLogin: false,
      });

      if (!user) {
        return next(new ErrorHandler("Email Not found", 400));
      }

      const token = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: "5m",
        }
      );
      const data = {
        name: user.name,
        token: `${process.env.EMAIL_VERIFY_NAVIGATE_URL as string}/${token
          .split(".")
          .join("---")}`,
      };
      try {
        await sendMail({
          email,
          subject: "Forget your password",
          template: "forgetPassword-mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to active your account.`,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const userSetNewPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password, token } = req.body;

      if (!password) {
        return next(new ErrorHandler("Please enter your password!", 400));
      }

      const { _id, exp } = jwt.verify(
        token.split("---").join("."),
        process.env.ACCESS_TOKEN_SECRET as string
      ) as JwtPayload;

      if (!_id) {
        return next(new ErrorHandler("Invalid credentials.", 403));
      }

      if (exp && Date.now() >= exp * 1000) {
        return next(new ErrorHandler("Token has expired.", 401));
      }

      const hashPassword = await bcrypt.hash(password, 10);
      await userModel.findByIdAndUpdate(_id, { password: hashPassword });
      res
        .status(200)
        .json({ success: true, message: "Password Change Successfully!" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
