import { Request } from "express";
import multer from "multer";
import path from "path";
import ErrorHandler from "../utils/errorHandler";

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: any, cb: any) => {
  const allowedFileTypes = [".jpg", ".jpeg", ".png"];

  // Check if the file extension is in the allowed list
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (allowedFileTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(
      new ErrorHandler(
        "Invalid file type. Only images with extensions .jpg, .jpeg, .png, and .gif are allowed.",
        400
      )
    );
  }
};

const uploadPicture = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    files: 1,
  },
});

export default uploadPicture;
