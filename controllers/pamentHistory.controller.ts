import { NextFunction, Response, Request } from "express";
import ErrorHandler from "../utils/errorHandler";
import { catchAsyncError } from "../middlewares/error";
import PamentHistoryModel from "../models/pamentHistory.model";
import userModel from "../models/user.model";
import { redis } from "../utils/redis";

interface ICreatePamentHistory {
  type: "premium" | "enterprise";
  downloadlimite: number;
  timeLimite: number;
  amount: number;
}

export const createPamentHistory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, downloadlimite, timeLimite, amount } =
        req.body as ICreatePamentHistory;

      if (!type || !downloadlimite || !timeLimite || !amount) {
        return next(new ErrorHandler("Invalid Data", 400));
      }

      const pamentHistory = new PamentHistoryModel({
        user: req.user,
        type,
        downloadlimite,
        timeLimite,
        amount,
      });

      const history = await pamentHistory.save();

      const updateUser = await userModel.findOneAndUpdate(
        { _id: req.user?._id },
        {
          ...req.user,
          plan: {
            type: type,
            downloadlimite: downloadlimite,
            timeLimite: timeLimite,
            checkoutDate: Date.now(),
          },
        },
        { new: true, upsert: true }
      );

      await redis.set(req.user?._id, JSON.stringify(updateUser) as any);

      res
        .status(201)
        .json({ success: true, pamentHistory: history, user: updateUser });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
