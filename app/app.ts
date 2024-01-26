import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { configDotenv } from "dotenv";

configDotenv();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN }));

// router
app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
  res.send("server is run....");
});

export default app;
