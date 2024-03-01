import express from "express";

import { isAuthenticated } from "../middlewares/auth";
import {
  createPamentHistory,
  getAllPamentHistory,
} from "../controllers/pamentHistory.controller";

const pamentHistoryRoute = express.Router();

pamentHistoryRoute.post("/create", isAuthenticated, createPamentHistory);
pamentHistoryRoute.get("/", isAuthenticated, getAllPamentHistory);

export default pamentHistoryRoute;
