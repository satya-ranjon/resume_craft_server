"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coverLetter_controller_1 = require("../controllers/coverLetter.controller");
const coverLetterRoute = express_1.default.Router();
coverLetterRoute.post("/create", coverLetter_controller_1.createOrUpdateCoverLetter);
coverLetterRoute.get("/:id", coverLetter_controller_1.getSingleCoverLetter);
exports.default = coverLetterRoute;
