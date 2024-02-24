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
exports.getShareTemplate = exports.generateTemplateShare = exports.userInfoChange = exports.uploadProfilePicture = void 0;
const multerHandle_1 = __importDefault(require("../middlewares/multerHandle"));
const user_model_1 = __importDefault(require("../models/user.model"));
const cloudinary_services_1 = require("../services/cloudinary.services");
const redis_1 = require("../utils/redis");
const error_1 = require("../middlewares/error");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const resume_modle_1 = __importDefault(require("../models/resume.modle"));
const coverLetter_modle_1 = __importDefault(require("../models/coverLetter.modle"));
const uploadProfilePicture = (req, res, next) => {
    multerHandle_1.default.single("resumeCraftProfilePic")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err) {
                return next(err);
            }
            if (!req.file) {
                return next(new errorHandler_1.default("No file uploaded", 400));
            }
            const user = yield user_model_1.default.findById(req.user);
            if (!user) {
                return next(new errorHandler_1.default("User not found", 400));
            }
            const avatar = yield (0, cloudinary_services_1.uploadImage)(req.file.buffer, 300, 300, "resumeCraft_user_avatar");
            user.avatar = {
                url: avatar.secure_url,
                public_id: avatar.public_id,
            };
            const updateInfo = yield user.save();
            yield redis_1.redis.set(user._id, JSON.stringify(updateInfo));
            res.status(200).json({ success: true, user: updateInfo });
        }
        catch (error) {
            next(error);
        }
    }));
};
exports.uploadProfilePicture = uploadProfilePicture;
exports.userInfoChange = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { name, email } = req.body;
        const another = yield user_model_1.default.findOne({ email: email });
        if ((another === null || another === void 0 ? void 0 : another._id) && (another === null || another === void 0 ? void 0 : another._id.toHexString()) !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return next(new errorHandler_1.default("This email already exist!", 400));
        }
        const updateInfo = yield user_model_1.default.findOneAndUpdate({ _id: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id }, Object.assign(Object.assign({}, req.user), { name: name, email: email }), { new: true, upsert: true });
        yield redis_1.redis.set(updateInfo._id, JSON.stringify(updateInfo));
        res.status(200).json({
            success: true,
            message: "User Info Update Successfully",
            user: updateInfo,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.generateTemplateShare = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { templateId, type, expiresIn } = req.body;
    if (!templateId || !type) {
        return next(new errorHandler_1.default("Invalid cradintial", 400));
    }
    if (expiresIn) {
        const token = jsonwebtoken_1.default.sign({ templateId, type }, process.env.ACCESS_TOKEN_SECRET, { expiresIn, algorithm: "HS512" });
        res.status(200).json(token);
    }
    const token = jsonwebtoken_1.default.sign({ templateId, type }, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: "HS512",
    });
    res.status(200).json(token);
}));
exports.getShareTemplate = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new errorHandler_1.default("Invalid cradintial", 400));
        }
        const { templateId, type } = jsonwebtoken_1.default.verify(id, process.env.ACCESS_TOKEN_SECRET);
        if (!templateId || !type) {
            return next(new errorHandler_1.default("Invalid cradintial", 400));
        }
        if (type === "resume") {
            const resumeData = yield resume_modle_1.default.findById(templateId);
            res
                .status(200)
                .json({ success: true, type: "resume", data: resumeData });
        }
        if (type === "coverletter") {
            const coverLetterData = yield coverLetter_modle_1.default.findById(templateId);
            res
                .status(200)
                .json({ success: true, type: "coverletter", data: coverLetterData });
        }
        return next(new errorHandler_1.default("Invalid cradintial", 400));
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
