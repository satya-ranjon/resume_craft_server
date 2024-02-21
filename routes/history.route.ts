import express from "express";

import {
  createUpdateHistory,
  deleteHistory,
  uploadHistoryThumbnail,
  userHistory,
} from "../controllers/history.controller";
import { isAuthenticated } from "../middlewares/auth";

const historyRoute = express.Router();

historyRoute.get("/", isAuthenticated, userHistory);
historyRoute.post("/create", isAuthenticated, createUpdateHistory);
historyRoute.patch("/upload/:id", isAuthenticated, uploadHistoryThumbnail);
historyRoute.delete("/delete/:id", isAuthenticated, deleteHistory);

export default historyRoute;
