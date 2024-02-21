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
exports.uploadProfilePicture = void 0;
const multerHandle_1 = __importDefault(require("../middlewares/multerHandle"));
const user_model_1 = __importDefault(require("../models/user.model"));
const cloudinary_services_1 = require("../services/cloudinary.services");
const uploadProfilePicture = (req, res, next) => {
    // Upload the profile picture using the multer middleware
    multerHandle_1.default.single("resumeCraftProfilePic")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err) {
                return next(err);
            }
            // Ensure that req.file exists
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            // Fetch the user data from the database using the user ID
            const user = yield user_model_1.default.findById(req.user);
            // Ensure that user exists
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            // Get the public IDs of the user's existing profile pictures
            const oldPublicId = user.avatar.public_id;
            // Delete the old profile pictures from Cloudinary if they exist
            if (oldPublicId) {
                yield (0, cloudinary_services_1.deleteImageFromCloudinary)(oldPublicId);
            }
            // Upload image with dimensions 64*64
            const avatar = yield (0, cloudinary_services_1.uploadImage)(req.file.buffer, 200, 200, "user_profile");
            // Update the user's avatar data in the user object
            user.avatar = {
                url: avatar.secure_url,
                public_id: avatar.public_id,
            };
            // Save the updated user information to the database
            const updateInfo = yield user.save();
            // Respond with the updated user data without sensitive information
            res.status(200).json(updateInfo);
        }
        catch (error) {
            // If an error occurs during the process, pass it to the error handling middleware
            next(error);
        }
    }));
};
exports.uploadProfilePicture = uploadProfilePicture;
