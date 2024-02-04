import express from "express";
import { userActivation, userRegister } from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/register", userRegister);
authRouter.post("/activate", userActivation);

export default authRouter;
