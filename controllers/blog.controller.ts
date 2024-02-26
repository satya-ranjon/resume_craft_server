import { NextFunction, Request, Response } from "express";
import uploadPicture from "../middlewares/multerHandle";
import {
    deleteImageFromCloudinary,
    uploadImage,
  } from "../services/cloudinary.services";
import BlogModel, {IBlog} from "../models/blog.model";
import { catchAsyncError } from "../middlewares/error";
import ErrorHandler from "../utils/errorHandler";

export const createBlog=catchAsyncError(
    async(req:Request, res:Response, next:NextFunction)=>{
        try{
            const data:IBlog=req.body;
            const user=req.user;
            const blog=await BlogModel.create({...data, user});
            res.status(201).json({
                success:true,
                message:"Blog created successfully",
                blog
            })
        }
        catch(error:any){
            return next(new ErrorHandler(error.message, 400));
        }
    }

);
export const imageUpload=(req:Request, res:Response, next:NextFunction)=>{
    uploadPicture.single("blogImage")(req, res, async (err)=>{
        try{
            if(err){
                return next(new ErrorHandler(err.message, 400));
            }
            if(!req.file){
                return next(new ErrorHandler("Please upload an image", 400));
            }
            const result=await uploadImage(
                req.file.buffer,
                700,
                600,
                "blogsImages"
            );
            console.log(result);
            res.status(201).json({
                success:true,
                image:{url:result.secure_url,
                    public_id:result.public_id}
            })
        }
        catch(error:any){
            return next(new ErrorHandler(error.message, 400));
        }
    })
};
export const deleteBlog=catchAsyncError(
    async(req:Request, res:Response, next:NextFunction)=>{
        try{
            const deleteBlog=await BlogModel.findByIdAndDelete(req.params.id);
            if(deleteBlog){
                await deleteImageFromCloudinary(deleteBlog.image.public_id);
            }
            res.status(200).json({
                success:true,
                message:"Blog deleted successfully"
            })
        }
        catch(error:any){
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

export const updateBlog=catchAsyncError(
    async(req:Request, res:Response, next:NextFunction)=>{
        try{
            if(req.params.id){
                const blog=await BlogModel.findById(req.params.id);
                if(blog){
                    if(req.body.image){
                        await deleteImageFromCloudinary(blog.image.public_id);
                    }
                    const updatedBlog=await BlogModel.findByIdAndUpdate(req.params.id, {...req.body,user:req.user?._id},
                         {new:true, runValidators:true});
                    res.status(200).json({
                        success:true,
                        message:"Blog updated successfully",
                        updatedBlog
                    })
                }
                else{
                    return next(new ErrorHandler("Blog not found", 404));
                }
            }
        }
        catch(error:any){
            return next(new ErrorHandler(error.message, 400));
        }
    }
);
export const getSingleBlog=catchAsyncError(
    async(req:Request, res:Response, next:NextFunction)=>{
        try{
            const blog=await BlogModel.findById(req.params.id);
            if(blog){
                res.status(200).json({
                    success:true,
                    blog
                })
            }
            else{
                return next(new ErrorHandler("Blog not found", 404));
            }
        }
        catch(error:any){
            return next(new ErrorHandler(error.message, 400));
        }
    }
);
export const getAllBlogs=catchAsyncError(
    async(req:Request, res:Response, next:NextFunction)=>{
        try{
            const blogs=await BlogModel.find();
            if(blogs){
                res.status(200).json({
                    success:true,
                    blogs
                })
            }
            else{
                return next(new ErrorHandler("No blogs found", 404));
            }
        }
        catch(error:any){
            return next(new ErrorHandler(error.message, 400));
        }
    }
);




