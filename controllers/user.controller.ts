import { NextFunction, Request, Response } from "express";
import uploadPicture from "../middlewares/multerHandle";
import userModel from "../models/user.model";
import {
  deleteImageFromCloudinary,
  uploadImage,
} from "../services/cloudinary.services";

export const uploadProfilePicture = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Upload the profile picture using the multer middleware
  uploadPicture.single("resumeCraftProfilePic")(req, res, async (err) => {
    try {
      if (err) {
        return next(err);
      }

      // Ensure that req.file exists
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Get the user ID from the request
      const userId = req.user?._id;

      // Fetch the user data from the database using the user ID
      const user = await userModel.findById(userId);

      // Ensure that user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get the public IDs of the user's existing profile pictures
      const oldPublicId = user.avatar.public_id;

      // Delete the old profile pictures from Cloudinary if they exist
      if (oldPublicId) {
        await deleteImageFromCloudinary(oldPublicId);
      }

      // Upload image with dimensions 64*64
      const avatar = await uploadImage(
        req.file.buffer,
        200,
        200,
        "user_profile"
      );

      // Update the user's avatar data in the user object
      user.avatar = {
        url: avatar.secure_url,
        public_id: avatar.public_id,
      };

      // Save the updated user information to the database
      const updateInfo = await user.save();

      // Respond with the updated user data without sensitive information
      res.status(200).json(updateInfo);
    } catch (error) {
      // If an error occurs during the process, pass it to the error handling middleware
      next(error);
    }
  });
};
