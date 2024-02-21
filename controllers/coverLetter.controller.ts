import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middlewares/error";
import ErrorHandler from "../utils/errorHandler";
import CoverLetterModel from "../models/coverLetter.modle";

export const createOrUpdateCoverLetter = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coverLetterData = req.body;

      const existing = await CoverLetterModel.findById(coverLetterData._id);

      const existingCoverLetter = await CoverLetterModel.findOneAndUpdate(
        { _id: coverLetterData._id },
        { ...coverLetterData, user: req.user },
        { new: true, upsert: true }
      );

      res.status(201).json({
        success: true,
        message: `CoverLetter ${
          existing ? "updated" : "created"
        } successfully.`,
        coverLetter: existingCoverLetter,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getSingleCoverLetter = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const coverLetter = await CoverLetterModel.findById(id).select("-user");

      res.status(201).json({
        success: true,
        coverLetter: coverLetter,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
