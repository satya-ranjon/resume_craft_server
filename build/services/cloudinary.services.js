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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageFromCloudinary = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
// Initialize Cloudinary with environment variables
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadImage = (buffer, width, height, folder) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader
            .upload_stream({ folder: folder, width, height, crop: "fill" }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                if (result) {
                    resolve(result);
                }
                else {
                    reject(new Error("Upload response is undefined"));
                }
            }
        })
            .end(buffer);
    });
});
exports.uploadImage = uploadImage;
const deleteImageFromCloudinary = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cloudinary_1.v2.uploader.destroy(publicId);
    }
    catch (error) {
        throw error;
    }
});
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
