import express from "express";
import {
  createBlog,
  deleteBlog,
  imageUpload,
  updateBlog,
  getAllBlogs,
  getSingleBlog,
} from "../controllers/blog.controller";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth";

const blogRouter = express.Router();

blogRouter.post(
  "/createBlog",
  isAuthenticated,
  authorizeRoles("admin"),
  createBlog
);
blogRouter.patch("/update/:id", isAuthenticated, updateBlog);
blogRouter.post("/imageUpload", isAuthenticated, imageUpload);
blogRouter.delete("/delete/:id", isAuthenticated, deleteBlog);
blogRouter.get("/single/:id", getSingleBlog);
blogRouter.get("/all", getAllBlogs);

export default blogRouter;
