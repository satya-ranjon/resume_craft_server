import express from "express";
import {
  updateAccessToken,
  userActivation,
  userGoogleLogin,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth";

const authRouter = express.Router();

authRouter.post("/register", userRegister);
authRouter.post("/activate", userActivation);
authRouter.post("/login", userLogin);
authRouter.get("/logout", isAuthenticated, userLogout);
authRouter.get("/refresh", isAuthenticated, updateAccessToken);
authRouter.post("/google/login", userGoogleLogin);

export default authRouter;
