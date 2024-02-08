import express from "express";
import { createOrUpdateResume } from "../controllers/resume.controller";

const resumeRoute = express.Router();

resumeRoute.post("/create", createOrUpdateResume);

export default resumeRoute;
