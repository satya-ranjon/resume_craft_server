import { NextFunction, Request, Response } from "express";
import uploadPicture from "../middlewares/multerHandle";
import {
  deleteImageFromCloudinary,
  uploadImage,
} from "../services/cloudinary.services";
import HistoryModel, { IHistory } from "../models/history.modle";
import { catchAsyncError } from "../middlewares/error";
import ErrorHandler from "../utils/errorHandler";
import ResumeModel from "../models/resume.modle";
import CoverLetterModel from "../models/coverLetter.modle";

export const createUpdateHistory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IHistory = req.body;
      const userId = "65bfd0f85443cc82b0f3f504";
      const existing = await HistoryModel.findById(data._id);

      const existinghistory = await HistoryModel.findOneAndUpdate(
        { _id: data._id },
        { ...data, user: userId },
        { new: true, upsert: true }
      );

      res.status(201).json({
        success: true,
        message: `History ${existing ? "updated" : "created"}  successfully.`,
        history: existinghistory,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const userHistory = catchAsyncError(
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const history = await HistoryModel.find({
        user: "65bfd0f85443cc82b0f3f504",
      });

      res.status(201).json({
        success: true,
        history: history,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const uploadHistoryThumbnail = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadPicture.single("Thumbnail")(req, res, async (err) => {
    try {
      if (err) {
        return next(err);
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { id } = req.params;
      const history = await HistoryModel.findById(id);

      if (!history) {
        return res.status(404).json({ message: "History not found" });
      }

      const oldPublicId = history.thumbnail.public_id;
      if (oldPublicId) {
        await deleteImageFromCloudinary(oldPublicId);
      }

      const avatar = await uploadImage(
        req.file.buffer,
        612,
        792,
        "resumeCraft_history_thumbnail"
      );

      history.thumbnail = {
        url: avatar.secure_url,
        public_id: avatar.public_id,
      };

      const updateInfo = await history.save();

      res.status(200).json({
        success: true,
        message: "Successfully Upload History Image",
        thumbnail: updateInfo,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  });
};

export const deleteHistory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = "65bfd0f85443cc82b0f3f504";

      const history = await HistoryModel.findOne({
        _id: id,
        user: userId,
      });

      if (history && history.templateId) {
        const deletedTemplate = await Promise.all([
          HistoryModel.findOneAndDelete({
            _id: history._id,
            user: userId,
          }),
          ResumeModel.findOneAndDelete({
            _id: history.templateId,
            user: userId,
          }),
          CoverLetterModel.findOneAndDelete({
            _id: history.templateId,
            user: userId,
          }),
        ]);

        res.status(201).json({
          success: true,
          history: `History delete  ${history.title}`,
          template: deletedTemplate[1]
            ? "Resume Templae Delete"
            : deletedTemplate[2] && "CoverLetter Templae Delete",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "History not found or does not have a template",
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
