import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { configDotenv } from "dotenv";
import authRouter from "../routes/auth.route";
import {
  catchAllUndefinedRoutes,
  globalErrorHandler,
} from "../middlewares/error";
import resumeRoute from "../routes/resume.route";
import userRoute from "../routes/user.route";
import historyRoute from "../routes/history.route";
import coverLetterRoute from "../routes/coverLetter.route";
import cookieParser from "cookie-parser";
import blogRouter from "../routes/blog.route";
import pamentHistoryRoute from "../routes/pamentHistory.route";
import paymentRoute from "../routes/payment.route";

configDotenv();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());

// router
app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
  res.send("server is run....");
});

app.use("/auth/v1", authRouter);
app.use("/resume/v1", resumeRoute);
app.use("/coverLetter/v1", coverLetterRoute);
app.use("/user/v1", userRoute);
app.use("/history/v1", historyRoute);
app.use("/blog/v1", blogRouter);
app.use("/payment/v1/history", pamentHistoryRoute);
app.use("/payment/v1", paymentRoute);

// handling undefined routes
app.use(catchAllUndefinedRoutes);

// Global error handler
app.use(globalErrorHandler);

export default app;
