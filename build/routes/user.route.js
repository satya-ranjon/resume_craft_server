"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middlewares/auth");
const userRoute = express_1.default.Router();
userRoute.patch("/upload-profile-picture", auth_1.isAuthenticated, user_controller_1.uploadProfilePicture);
userRoute.patch("/info-change", auth_1.isAuthenticated, user_controller_1.userInfoChange);
userRoute.post("/create/share", auth_1.isAuthenticated, user_controller_1.generateTemplateShare);
userRoute.get("/share/data/:id", user_controller_1.getShareTemplate);
userRoute.get("/download", auth_1.isAuthenticated, user_controller_1.downloadTemplae);
exports.default = userRoute;
