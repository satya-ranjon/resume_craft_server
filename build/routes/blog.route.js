"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("../controllers/blog.controller");
const auth_1 = require("../middlewares/auth");
const blogRouter = express_1.default.Router();
blogRouter.post("/createBlog", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), blog_controller_1.createBlog);
blogRouter.patch("/update/:id", auth_1.isAuthenticated, blog_controller_1.updateBlog);
blogRouter.post("/imageUpload", auth_1.isAuthenticated, blog_controller_1.imageUpload);
blogRouter.delete("/delete/:id", auth_1.isAuthenticated, blog_controller_1.deleteBlog);
blogRouter.get("/single/:id", blog_controller_1.getSingleBlog);
blogRouter.get("/all", blog_controller_1.getAllBlogs);
exports.default = blogRouter;
