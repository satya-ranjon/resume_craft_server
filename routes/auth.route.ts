import express from "express";
import {
  userActivation,
  userLogin,
  userRegister,
} from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/register", userRegister);
authRouter.post("/activate", userActivation);
authRouter.post("/login", userLogin);

export default authRouter;
