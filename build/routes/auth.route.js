"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middlewares/auth");
const authRouter = express_1.default.Router();
authRouter.post("/register", auth_controller_1.userRegister);
authRouter.post("/activate", auth_controller_1.userActivation);
authRouter.post("/login", auth_controller_1.userLogin);
authRouter.get("/logout", auth_1.isAuthenticated, auth_controller_1.userLogout);
authRouter.get("/refresh", auth_1.isAuthenticated, auth_controller_1.updateAccessToken);
authRouter.post("/google/login", auth_controller_1.userGoogleLogin);
authRouter.post("/password/forget", auth_controller_1.userForgetPassword);
authRouter.post("/password/new", auth_controller_1.userSetNewPassword);
exports.default = authRouter;
