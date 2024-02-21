import { NextFunction, Request, Response } from "express";
import { IResume } from "../@types/resume";
import { catchAsyncError } from "../middlewares/error";
import ErrorHandler from "../utils/errorHandler";
import ResumeModel from "../models/resume.modle";
import uploadPicture from "../middlewares/multerHandle";
import {
  deleteImageFromCloudinary,
  uploadImage,
} from "../services/cloudinary.services";

export const createOrUpdateResume = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resumeData: IResume = req.body;

      const existing = await ResumeModel.findById(resumeData._id);

      if (
        existing &&
        !resumeData.avatar.public_id &&
        !resumeData.avatar.public_id
      ) {
        const oldPublicId = existing?.avatar.public_id;
        if (oldPublicId) {
          await deleteImageFromCloudinary(oldPublicId);
        }
      }

      const existingResume = await ResumeModel.findOneAndUpdate(
        { _id: resumeData._id },
        { ...resumeData, user: req.user },
        { new: true, upsert: true }
      );

      res.status(201).json({
        success: true,
        message: `Resume ${existing ? "updated" : "created"} successfully.`,
        resume: existingResume,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getSingleResume = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const resume = await ResumeModel.findById(id).select("-user");

      res.status(201).json({
        success: true,
        resume: resume,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const uploadReasumeAvatar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadPicture.single("resumeCraftResumeAvatar")(req, res, async (err) => {
    try {
      if (err) {
        return next(err);
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { id } = req.params;
      const resume = await ResumeModel.findById(id);

      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      const oldPublicId = resume.avatar.public_id;
      if (oldPublicId) {
        await deleteImageFromCloudinary(oldPublicId);
      }

      const avatar = await uploadImage(
        req.file.buffer,
        200,
        200,
        "resumeCraft_resume_Avatar"
      );

      resume.avatar = {
        url: avatar.secure_url,
        public_id: avatar.public_id,
      };

      const updateInfo = await resume.save();

      res.status(200).json({
        success: true,
        message: "Successfully Upload Reasume Image",
        avatar: updateInfo.avatar,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  });
};
