import express from "express";
import { uploadProfilePicture } from "../controllers/user.controller";

const userRoute = express.Router();

userRoute.patch("/upload-profile-picture", uploadProfilePicture);

export default userRoute;
