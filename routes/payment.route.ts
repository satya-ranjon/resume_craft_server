import express, { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middlewares/error";
import ErrorHandler from "../utils/errorHandler";
import {
  allPayment,
  creaetPayment,
  deletePayment,
  editPayment,
  singlePayment,
} from "../controllers/payment.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
const stripe = require("stripe")(process.env.SCRIPE_SECRET_KEY);

const paymentRoute = express.Router();

paymentRoute.get("/single", singlePayment);

paymentRoute.get("/", isAuthenticated, authorizeRoles("admin"), allPayment);
paymentRoute.post("/", isAuthenticated, authorizeRoles("admin"), creaetPayment);
paymentRoute.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deletePayment
);
paymentRoute.put("/:id", isAuthenticated, authorizeRoles("admin"), editPayment);

interface IPrice {
  price: number;
}

paymentRoute.post(
  "/payment-intent",
  catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { price } = req.body as IPrice;

      if (isNaN(price) || price <= 0) {
        return next(new ErrorHandler("Invalid price", 400));
      }

      const amount = price * 100;

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

export default paymentRoute;
