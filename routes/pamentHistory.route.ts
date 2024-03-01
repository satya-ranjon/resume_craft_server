import express from "express";

import { isAuthenticated } from "../middlewares/auth";
import { createPamentHistory } from "../controllers/pamentHistory.controller";

const pamentHistoryRoute = express.Router();

pamentHistoryRoute.post("/create", isAuthenticated, createPamentHistory);

export default pamentHistoryRoute;
