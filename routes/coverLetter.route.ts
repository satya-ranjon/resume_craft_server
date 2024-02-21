import express from "express";
import {
  createOrUpdateCoverLetter,
  getSingleCoverLetter,
} from "../controllers/coverLetter.controller";
import { isAuthenticated } from "../middlewares/auth";

const coverLetterRoute = express.Router();

coverLetterRoute.post("/create", isAuthenticated, createOrUpdateCoverLetter);
coverLetterRoute.get("/:id", isAuthenticated, getSingleCoverLetter);

export default coverLetterRoute;
