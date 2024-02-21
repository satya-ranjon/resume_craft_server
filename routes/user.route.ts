import express from "express";
import { uploadProfilePicture } from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth";

const userRoute = express.Router();

userRoute.patch(
  "/upload-profile-picture",
  isAuthenticated,
  uploadProfilePicture
);

export default userRoute;
