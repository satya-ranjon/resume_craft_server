import express from "express";
import {
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

export default userRoute;
