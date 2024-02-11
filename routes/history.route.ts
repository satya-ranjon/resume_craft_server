import express from "express";

import {
  createUpdateHistory,
  uploadHistoryThumbnail,
  userHistory,
} from "../controllers/history.controller";

const historyRoute = express.Router();

historyRoute.get("/", userHistory);
historyRoute.post("/create", createUpdateHistory);
historyRoute.patch("/upload/:id", uploadHistoryThumbnail);

export default historyRoute;
