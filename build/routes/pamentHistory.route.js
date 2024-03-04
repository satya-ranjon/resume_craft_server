"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const pamentHistory_controller_1 = require("../controllers/pamentHistory.controller");
const pamentHistoryRoute = express_1.default.Router();
pamentHistoryRoute.post("/create", auth_1.isAuthenticated, pamentHistory_controller_1.createPamentHistory);
pamentHistoryRoute.get("/", auth_1.isAuthenticated, pamentHistory_controller_1.getAllPamentHistory);
exports.default = pamentHistoryRoute;
