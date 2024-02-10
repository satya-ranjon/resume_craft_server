"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleResume = exports.createOrUpdateResume = void 0;
const error_1 = require("../middlewares/error");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const resume_modle_1 = __importDefault(require("../models/resume.modle"));
exports.createOrUpdateResume = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resumeData = req.body;
        const existing = yield resume_modle_1.default.findById(resumeData._id);
        const existingResume = yield resume_modle_1.default.findOneAndUpdate({ _id: resumeData._id }, resumeData, { new: true, upsert: true });
        res.status(201).json({
            success: true,
            message: `Resume ${existing ? "updated" : "created"} successfully.`,
            resume: existingResume,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.getSingleResume = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const resume = yield resume_modle_1.default.findById(id).select("-user");
        res.status(201).json({
            success: true,
            resume: resume,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
