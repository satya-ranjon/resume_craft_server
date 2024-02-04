import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middlewares/error";
import {
  checkActiveToken,
  createActivationToken,
} from "../services/auth.services";
import ErrorHandler from "../utils/errorHandler";
import userModel from "../models/user.model";
import sendMail from "../utils/sendMail";

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
      console.log(existUser);

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
