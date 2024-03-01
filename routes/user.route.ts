import express from "express";
import {
  downloadTemplae,
  generateTemplateShare,
  getShareTemplate,
  uploadProfilePicture,
  userInfoChange,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth";

const userRoute = express.Router();

userRoute.patch(
  "/upload-profile-picture",
  isAuthenticated,
  uploadProfilePicture
);
userRoute.patch("/info-change", isAuthenticated, userInfoChange);
userRoute.post("/create/share", isAuthenticated, generateTemplateShare);
userRoute.get("/share/data/:id", getShareTemplate);
userRoute.get("/download", isAuthenticated, downloadTemplae);

export default userRoute;
