import { NextFunction, Request, Response } from "express";
import uploadPicture from "../middlewares/multerHandle";
import userModel from "../models/user.model";
import {
  deleteImageFromCloudinary,
  uploadImage,
} from "../services/cloudinary.services";
import { redis } from "../utils/redis";
import { catchAsyncError } from "../middlewares/error";
import ErrorHandler from "../utils/errorHandler";

export const uploadProfilePicture = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadPicture.single("resumeCraftProfilePic")(req, res, async (err) => {
    try {
      if (err) {
        return next(err);
      }

      if (!req.file) {
        return next(new ErrorHandler("No file uploaded", 400));
      }

      const user = await userModel.findById(req.user);
      console.log(req.user);
      console.log(user);

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const avatar = await uploadImage(
        req.file.buffer,
        300,
        300,
        "resumeCraft_user_avatar"
      );

      user.avatar = {
        url: avatar.secure_url,
        public_id: avatar.public_id,
      };
      const updateInfo = await user.save();

      await redis.set(user._id, JSON.stringify(updateInfo) as any);

      res.status(200).json({ success: true, user: updateInfo });
    } catch (error) {
      next(error);
    }
  });
};

export const userInfoChange = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body;

      const another = await userModel.findOne({ email: email });

      if (another?._id && another?._id.toHexString() !== req.user?._id) {
        return next(new ErrorHandler("This email already exist!", 400));
      }
      const updateInfo = await userModel.findOneAndUpdate(
        { _id: req.user?._id },
        { ...req.user, name: name, email: email },
        { new: true, upsert: true }
      );
      await redis.set(updateInfo._id, JSON.stringify(updateInfo) as any);

      res.status(200).json({
        success: true,
        message: "User Info Update Successfully",
        user: updateInfo,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
