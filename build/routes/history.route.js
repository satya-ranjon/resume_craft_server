"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const history_controller_1 = require("../controllers/history.controller");
const auth_1 = require("../middlewares/auth");
const historyRoute = express_1.default.Router();
historyRoute.get("/", auth_1.isAuthenticated, history_controller_1.userHistory);
historyRoute.post("/create", auth_1.isAuthenticated, history_controller_1.createUpdateHistory);
historyRoute.patch("/upload/:id", auth_1.isAuthenticated, history_controller_1.uploadHistoryThumbnail);
historyRoute.delete("/delete/:id", auth_1.isAuthenticated, history_controller_1.deleteHistory);
exports.default = historyRoute;
