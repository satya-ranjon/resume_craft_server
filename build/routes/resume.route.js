"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resume_controller_1 = require("../controllers/resume.controller");
const resumeRoute = express_1.default.Router();
resumeRoute.post("/create", resume_controller_1.createOrUpdateResume);
resumeRoute.get("/:id", resume_controller_1.getSingleResume);
exports.default = resumeRoute;