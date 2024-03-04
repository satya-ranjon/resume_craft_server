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
  transactionId: string;
  price: string;
}

//* if user downloadlimite timeLimite over then set just new downloadlimite or timeLimite not over then current downloadlimite + new downloadlimite

export const createPamentHistory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, downloadlimite, timeLimite, amount, transactionId, price } =
        req.body as ICreatePamentHistory;

      if (
        !type ||
        !downloadlimite ||
        !timeLimite ||
        !amount ||
        !transactionId ||
        !price
      ) {
        return next(new ErrorHandler("Invalid Data", 400));
      }

      const pamentHistory = new PamentHistoryModel({
        user: req.user,
        type,
        downloadlimite,
        timeLimite,
        amount,
        transactionId,
        price,
      });

      const history = await pamentHistory.save();

      if (req.user) {
        const timeLimiteDifference = Date.now() - req.user.plan.checkoutDate;
        const IsdaysDifferenceTrue =
          Math.floor(timeLimiteDifference / (1000 * 60 * 60 * 24)) >
          req.user.plan.timeLimite;

        const updateUser = await userModel.findOneAndUpdate(
          { _id: req.user?._id },
          {
            ...req.user,
            plan: {
              type: type,
              downloadlimite: IsdaysDifferenceTrue
                ? downloadlimite
                : req.user.plan.downloadlimite + downloadlimite,
              timeLimite: timeLimite,
              checkoutDate: Date.now(),
            },
          },
          { new: true, upsert: true }
        );

        await redis.set(req.user?._id, JSON.stringify(updateUser) as any);
        res.status(201).json({
          success: true,
          pamentHistory: history,
          user: updateUser,
        });
      }

      return next(new ErrorHandler("Invalid Data", 400));
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllPamentHistory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const history = await PamentHistoryModel.find({
        user: req.user?._id,
      }).sort({ createdAt: -1 });

      res.status(201).json({ success: true, history: history });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
