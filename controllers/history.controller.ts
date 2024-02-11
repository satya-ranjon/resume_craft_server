import { NextFunction, Request, Response } from "express";
import uploadPicture from "../middlewares/multerHandle";
import {
  deleteImageFromCloudinary,
  uploadImage,
} from "../services/cloudinary.services";
import HistoryModel, { IHistory } from "../models/history.modle";
import { catchAsyncError } from "../middlewares/error";
import ErrorHandler from "../utils/errorHandler";

export const createUpdateHistory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IHistory = req.body;

      const existing = await HistoryModel.findById(data._id);

      const existinghistory = await HistoryModel.findOneAndUpdate(
        { _id: data._id },
        data,
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
  uploadPicture.single("resumeCraftResumeThumbnail")(req, res, async (err) => {
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
        600,
        860,
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
