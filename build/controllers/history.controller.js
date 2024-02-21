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
exports.deleteHistory = exports.uploadHistoryThumbnail = exports.userHistory = exports.createUpdateHistory = void 0;
const multerHandle_1 = __importDefault(require("../middlewares/multerHandle"));
const cloudinary_services_1 = require("../services/cloudinary.services");
const history_modle_1 = __importDefault(require("../models/history.modle"));
const error_1 = require("../middlewares/error");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const resume_modle_1 = __importDefault(require("../models/resume.modle"));
const coverLetter_modle_1 = __importDefault(require("../models/coverLetter.modle"));
exports.createUpdateHistory = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const existing = yield history_modle_1.default.findById(data._id);
        const existinghistory = yield history_modle_1.default.findOneAndUpdate({ _id: data._id }, Object.assign(Object.assign({}, data), { user: req.user }), { new: true, upsert: true });
        res.status(201).json({
            success: true,
            message: `History ${existing ? "updated" : "created"}  successfully.`,
            history: existinghistory,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.userHistory = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const history = yield history_modle_1.default.find({
            user: req.user,
        });
        res.status(201).json({
            success: true,
            history: history,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
const uploadHistoryThumbnail = (req, res, next) => {
    multerHandle_1.default.single("Thumbnail")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err) {
                return next(err);
            }
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            const { id } = req.params;
            const history = yield history_modle_1.default.findById(id);
            if (!history) {
                return res.status(404).json({ message: "History not found" });
            }
            const oldPublicId = history.thumbnail.public_id;
            if (oldPublicId) {
                yield (0, cloudinary_services_1.deleteImageFromCloudinary)(oldPublicId);
            }
            const avatar = yield (0, cloudinary_services_1.uploadImage)(req.file.buffer, 612, 792, "resumeCraft_history_thumbnail");
            history.thumbnail = {
                url: avatar.secure_url,
                public_id: avatar.public_id,
            };
            const updateInfo = yield history.save();
            res.status(200).json({
                success: true,
                message: "Successfully Upload History Image",
                thumbnail: updateInfo,
            });
        }
        catch (error) {
            return next(new errorHandler_1.default(error.message, 400));
        }
    }));
};
exports.uploadHistoryThumbnail = uploadHistoryThumbnail;
exports.deleteHistory = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const history = yield history_modle_1.default.findOne({
            _id: id,
            user: req.user,
        });
        if (history && history.templateId) {
            const deletedTemplate = yield Promise.all([
                history_modle_1.default.findOneAndDelete({
                    _id: history._id,
                    user: req.user,
                }),
                resume_modle_1.default.findOneAndDelete({
                    _id: history.templateId,
                    user: req.user,
                }),
                coverLetter_modle_1.default.findOneAndDelete({
                    _id: history.templateId,
                    user: req.user,
                }),
            ]);
            res.status(201).json({
                success: true,
                history: `History delete  ${history.title}`,
                template: deletedTemplate[1]
                    ? "Resume Templae Delete"
                    : deletedTemplate[2] && "CoverLetter Templae Delete",
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: "History not found or does not have a template",
            });
        }
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
