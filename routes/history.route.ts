import express from "express";

import {
  createUpdateHistory,
  deleteHistory,
  uploadHistoryThumbnail,
  userHistory,
} from "../controllers/history.controller";

const historyRoute = express.Router();

historyRoute.get("/", userHistory);
historyRoute.post("/create", createUpdateHistory);
historyRoute.patch("/upload/:id", uploadHistoryThumbnail);
historyRoute.delete("/delete/:id", deleteHistory);

export default historyRoute;
