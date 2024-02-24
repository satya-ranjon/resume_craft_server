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
exports.getSingleCoverLetter = exports.createOrUpdateCoverLetter = void 0;
const error_1 = require("../middlewares/error");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const coverLetter_modle_1 = __importDefault(require("../models/coverLetter.modle"));
exports.createOrUpdateCoverLetter = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coverLetterData = req.body;
        const existing = yield coverLetter_modle_1.default.findById(coverLetterData._id);
        const existingCoverLetter = yield coverLetter_modle_1.default.findOneAndUpdate({ _id: coverLetterData._id }, Object.assign(Object.assign({}, coverLetterData), { user: req.user }), { new: true, upsert: true });
        res.status(201).json({
            success: true,
            message: `CoverLetter ${existing ? "updated" : "created"} successfully.`,
            coverLetter: existingCoverLetter,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.getSingleCoverLetter = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const coverLetter = yield coverLetter_modle_1.default.findById(id).select("-user");
        if (!coverLetter) {
            return next(new errorHandler_1.default("notfound", 400));
        }
        res.status(201).json({
            success: true,
            coverLetter: coverLetter,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
