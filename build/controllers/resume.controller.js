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
exports.uploadReasumeAvatar = exports.getSingleResume = exports.createOrUpdateResume = void 0;
const error_1 = require("../middlewares/error");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const resume_modle_1 = __importDefault(require("../models/resume.modle"));
const multerHandle_1 = __importDefault(require("../middlewares/multerHandle"));
const cloudinary_services_1 = require("../services/cloudinary.services");
exports.createOrUpdateResume = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resumeData = req.body;
        const existing = yield resume_modle_1.default.findById(resumeData._id);
        if (existing &&
            !resumeData.avatar.public_id &&
            !resumeData.avatar.public_id) {
            const oldPublicId = existing === null || existing === void 0 ? void 0 : existing.avatar.public_id;
            if (oldPublicId) {
                yield (0, cloudinary_services_1.deleteImageFromCloudinary)(oldPublicId);
            }
        }
        const existingResume = yield resume_modle_1.default.findOneAndUpdate({ _id: resumeData._id }, Object.assign(Object.assign({}, resumeData), { user: req.user }), { new: true, upsert: true });
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
        if (!resume) {
            return next(new errorHandler_1.default("notfound", 400));
        }
        res.status(201).json({
            success: true,
            resume: resume,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
const uploadReasumeAvatar = (req, res, next) => {
    multerHandle_1.default.single("resumeCraftResumeAvatar")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err) {
                return next(err);
            }
            if (!req.file) {
                return next(new errorHandler_1.default("No file uploaded", 400));
            }
            const { id } = req.params;
            const resume = yield resume_modle_1.default.findById(id);
            if (!resume) {
                return next(new errorHandler_1.default("Resume not found", 404));
            }
            const oldPublicId = resume.avatar.public_id;
            if (oldPublicId) {
                yield (0, cloudinary_services_1.deleteImageFromCloudinary)(oldPublicId);
            }
            const avatar = yield (0, cloudinary_services_1.uploadImage)(req.file.buffer, 200, 200, "resumeCraft_resume_Avatar");
            resume.avatar = {
                url: avatar.secure_url,
                public_id: avatar.public_id,
            };
            const updateInfo = yield resume.save();
            res.status(200).json({
                success: true,
                message: "Successfully Upload Reasume Image",
                avatar: updateInfo.avatar,
            });
        }
        catch (error) {
            return next(new errorHandler_1.default(error.message, 400));
        }
    }));
};
exports.uploadReasumeAvatar = uploadReasumeAvatar;
