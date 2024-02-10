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
exports.uploadHistoryThumbnail = exports.userHistory = exports.createHistory = void 0;
const multerHandle_1 = __importDefault(require("../middlewares/multerHandle"));
const cloudinary_services_1 = require("../services/cloudinary.services");
const history_modle_1 = __importDefault(require("../models/history.modle"));
const error_1 = require("../middlewares/error");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
exports.createHistory = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const history = yield history_modle_1.default.create(data);
        delete history.__v;
        res.status(201).json({
            success: true,
            message: `History created successfully.`,
            history: history,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.userHistory = (0, error_1.catchAsyncError)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const history = yield history_modle_1.default.find({
            user: "65bfd0f85443cc82b0f3f504",
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
    multerHandle_1.default.single("resumeCraftResumeThumbnail")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
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
            const avatar = yield (0, cloudinary_services_1.uploadImage)(req.file.buffer, 600, 860, "resumeCraft_history_thumbnail");
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
