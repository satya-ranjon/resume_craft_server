import express from "express";
import {
  createOrUpdateResume,
  getSingleResume,
  uploadReasumeAvatar,
} from "../controllers/resume.controller";
import { isAuthenticated } from "../middlewares/auth";

const resumeRoute = express.Router();

resumeRoute.post("/create", isAuthenticated, createOrUpdateResume);
resumeRoute.get("/:id", isAuthenticated, getSingleResume);
resumeRoute.patch("/upload/:id", isAuthenticated, uploadReasumeAvatar);

export default resumeRoute;
