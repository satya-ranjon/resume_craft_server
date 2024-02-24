import { NextFunction, Request, Response } from "express";
import uploadPicture from "../middlewares/multerHandle";
import userModel from "../models/user.model";
import { uploadImage } from "../services/cloudinary.services";
import { redis } from "../utils/redis";
import { catchAsyncError } from "../middlewares/error";
import ErrorHandler from "../utils/errorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import ResumeModel from "../models/resume.modle";
import CoverLetterModel from "../models/coverLetter.modle";
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

export const generateTemplateShare = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { templateId, type, expiresIn } = req.body;
    if (!templateId || !type) {
      return next(new ErrorHandler("Invalid cradintial", 400));
    }
    if (expiresIn) {
      const token = jwt.sign(
        { templateId, type },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn, algorithm: "HS512" }
      );
      res.status(200).json(token);
    }

    const token = jwt.sign(
      { templateId, type },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        algorithm: "HS512",
      }
    );
    res.status(200).json(token);
  }
);
export const getShareTemplate = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("Invalid cradintial", 400));
      }
      const { templateId, type } = jwt.verify(
        id,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as JwtPayload;

      if (!templateId || !type) {
        return next(new ErrorHandler("Invalid cradintial", 400));
      }

      if (type === "resume") {
        const resumeData = await ResumeModel.findById(templateId);
        res
          .status(200)
          .json({ success: true, type: "resume", data: resumeData });
      }
      if (type === "coverletter") {
        const coverLetterData = await CoverLetterModel.findById(templateId);
        res
          .status(200)
          .json({ success: true, type: "coverletter", data: coverLetterData });
      }
      return next(new ErrorHandler("Invalid cradintial", 400));
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
