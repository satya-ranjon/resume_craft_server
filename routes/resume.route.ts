import express from "express";
import {
  createOrUpdateResume,
  getSingleResume,
  uploadReasumeAvatar,
} from "../controllers/resume.controller";

const resumeRoute = express.Router();

resumeRoute.post("/create", createOrUpdateResume);
resumeRoute.get("/:id", getSingleResume);
resumeRoute.patch("/upload/:id", uploadReasumeAvatar);

export default resumeRoute;
