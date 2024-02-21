import express from "express";
import {
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

export default userRoute;
