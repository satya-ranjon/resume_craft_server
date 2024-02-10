"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (_req, file, cb) => {
    const allowedFileTypes = [".jpg", ".jpeg", ".png"];
    // Check if the file extension is in the allowed list
    const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(fileExtension)) {
        cb(null, true);
    }
    else {
        cb(new errorHandler_1.default("Invalid file type. Only images with extensions .jpg, .jpeg, .png, and .gif are allowed.", 400));
    }
};
const uploadPicture = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        files: 1,
    },
});
exports.default = uploadPicture;
