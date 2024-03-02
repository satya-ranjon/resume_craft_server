import { NextFunction, Response, Request } from "express";
import { catchAsyncError } from "../middlewares/error";
import PaymentModel, { Pricing } from "../models/payment.model";
import ErrorHandler from "../utils/errorHandler";

export const allPayment = catchAsyncError(
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await PaymentModel.find();
      res.status(201).json({ success: true, payment: payment });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const singlePayment = catchAsyncError(
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await PaymentModel.findOne({ active: true }).select(
        "monthly yearly"
      );
      res.status(201).json({ success: true, payment: payment });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const creaetPayment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentData: Pricing = req.body;
      const payment = await PaymentModel.create(paymentData);
      res.status(201).json({ success: true, payment });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const deletePayment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await PaymentModel.findByIdAndDelete(id);
      res
        .status(201)
        .json({ success: true, message: "Delete successfully complate" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const editPayment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const paymentData: Pricing = req.body;
      const updatedPayment = await PaymentModel.findByIdAndUpdate(
        id,
        paymentData,
        { new: true }
      );
      if (updatedPayment) {
        res.json(updatedPayment);
      } else {
        return next(new ErrorHandler("Payment not found", 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
