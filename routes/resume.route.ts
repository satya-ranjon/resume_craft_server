import express from "express";
import {
  createOrUpdateResume,
  getSingleResume,
} from "../controllers/resume.controller";

const resumeRoute = express.Router();

resumeRoute.post("/create", createOrUpdateResume);
resumeRoute.get("/:id", getSingleResume);

export default resumeRoute;
