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
exports.getAllBlogs = exports.getSingleBlog = exports.updateBlog = exports.deleteBlog = exports.imageUpload = exports.createBlog = void 0;
const multerHandle_1 = __importDefault(require("../middlewares/multerHandle"));
const cloudinary_services_1 = require("../services/cloudinary.services");
const blog_model_1 = __importDefault(require("../models/blog.model"));
const error_1 = require("../middlewares/error");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
exports.createBlog = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const user = req.user;
        const blog = yield blog_model_1.default.create(Object.assign(Object.assign({}, data), { user }));
        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
const imageUpload = (req, res, next) => {
    multerHandle_1.default.single("blogImage")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err) {
                return next(new errorHandler_1.default(err.message, 400));
            }
            if (!req.file) {
                return next(new errorHandler_1.default("Please upload an image", 400));
            }
            const result = yield (0, cloudinary_services_1.uploadImage)(req.file.buffer, 950, 550, "blogsImages");
            res.status(201).json({
                success: true,
                image: { url: result.secure_url, public_id: result.public_id },
            });
        }
        catch (error) {
            return next(new errorHandler_1.default(error.message, 400));
        }
    }));
};
exports.imageUpload = imageUpload;
exports.deleteBlog = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteBlog = yield blog_model_1.default.findByIdAndDelete(req.params.id);
        if (deleteBlog) {
            yield (0, cloudinary_services_1.deleteImageFromCloudinary)(deleteBlog.image.public_id);
        }
        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.updateBlog = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (req.params.id) {
            const blog = yield blog_model_1.default.findById(req.params.id);
            if (blog) {
                if (req.body.image) {
                    yield (0, cloudinary_services_1.deleteImageFromCloudinary)(blog.image.public_id);
                }
                const updatedBlog = yield blog_model_1.default.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), { user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }), { new: true, runValidators: true });
                res.status(200).json({
                    success: true,
                    message: "Blog updated successfully",
                    updatedBlog,
                });
            }
            else {
                return next(new errorHandler_1.default("Blog not found", 404));
            }
        }
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.getSingleBlog = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield blog_model_1.default.findById(req.params.id);
        if (blog) {
            res.status(200).json({
                success: true,
                blog,
            });
        }
        else {
            return next(new errorHandler_1.default("Blog not found", 404));
        }
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.getAllBlogs = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const skip = (page - 1) * perPage;
        const [blogs, total] = yield Promise.all([
            blog_model_1.default.find()
                .populate({ path: "user", select: "name email avatar" })
                .skip(skip)
                .limit(perPage)
                .exec(),
            blog_model_1.default.countDocuments().exec(),
        ]);
        if (blogs) {
            res.status(200).json({
                success: true,
                total,
                page,
                blogs,
            });
        }
        else {
            return next(new errorHandler_1.default("No blogs found", 404));
        }
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
