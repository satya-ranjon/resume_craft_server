"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const history_controller_1 = require("../controllers/history.controller");
const historyRoute = express_1.default.Router();
historyRoute.get("/", history_controller_1.userHistory);
historyRoute.post("/create", history_controller_1.createHistory);
historyRoute.patch("/upload/:id", history_controller_1.uploadHistoryThumbnail);
exports.default = historyRoute;
