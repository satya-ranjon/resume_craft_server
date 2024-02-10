import express from "express";

import {
  createHistory,
  uploadHistoryThumbnail,
  userHistory,
} from "../controllers/history.controller";

const historyRoute = express.Router();

historyRoute.get("/", userHistory);
historyRoute.post("/create", createHistory);
historyRoute.patch("/upload/:id", uploadHistoryThumbnail);

export default historyRoute;
