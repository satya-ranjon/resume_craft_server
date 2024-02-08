import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { configDotenv } from "dotenv";
import authRouter from "../routes/auth.route";
import {
  catchAllUndefinedRoutes,
  globalErrorHandler,
} from "../middlewares/error";
import resumeRoute from "../routes/resume.route";

configDotenv();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN }));

// router
app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
  res.send("server is run....");
});

app.use("/auth/v1", authRouter);
app.use("/resume/v1", resumeRoute);

// handling undefined routes
app.use(catchAllUndefinedRoutes);

// Global error handler
app.use(globalErrorHandler);

export default app;
