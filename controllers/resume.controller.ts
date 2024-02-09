import { NextFunction, Request, Response } from "express";
import { IResume } from "../@types/resume";
import { catchAsyncError } from "../middlewares/error";
import ErrorHandler from "../utils/errorHandler";
import ResumeModel from "../models/resume.modle";

export const createOrUpdateResume = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resumeData: IResume = req.body;

      const existing = await ResumeModel.findById(resumeData._id);

      const existingResume = await ResumeModel.findOneAndUpdate(
        { _id: resumeData._id },
        resumeData,
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

      const resume = await ResumeModel.findById(id);

      res.status(201).json({
        success: true,
        resume: resume,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
