import express from "express";
import {createBlog,deleteBlog,imageUpload,updateBlog,getAllBlogs,getSingleBlog
} from "../controllers/blog.controller";
import { isAuthenticated,authorizeRoles } from "../middlewares/auth";

const blogRouter = express.Router();

blogRouter.post("/createBlog", isAuthenticated,createBlog);
blogRouter.patch("/updateBlog/:id", isAuthenticated, updateBlog);
blogRouter.post("/imageUpload", isAuthenticated, imageUpload);
blogRouter.delete("/deleteBlog/:id", isAuthenticated, deleteBlog);
blogRouter.get("/getSingleBlog/:id", getSingleBlog);
blogRouter.get("/getAllBlogs", getAllBlogs);

export default blogRouter;