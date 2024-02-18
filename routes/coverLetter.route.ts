import express from "express";
import {
  createOrUpdateCoverLetter,
  getSingleCoverLetter,
} from "../controllers/coverLetter.controller";

const coverLetterRoute = express.Router();

coverLetterRoute.post("/create", createOrUpdateCoverLetter);
coverLetterRoute.get("/:id", getSingleCoverLetter);

export default coverLetterRoute;
