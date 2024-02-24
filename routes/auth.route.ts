import express from "express";
import {
  updateAccessToken,
  userActivation,
  userForgetPassword,
  userGoogleLogin,
  userLogin,
  userLogout,
  userRegister,
  userSetNewPassword,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth";

const authRouter = express.Router();

authRouter.post("/register", userRegister);
authRouter.post("/activate", userActivation);
authRouter.post("/login", userLogin);
authRouter.get("/logout", isAuthenticated, userLogout);
authRouter.get("/refresh", updateAccessToken);
authRouter.post("/google/login", userGoogleLogin);
authRouter.post("/password/forget", userForgetPassword);
authRouter.post("/password/new", userSetNewPassword);

export default authRouter;
