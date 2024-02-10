import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Initialize Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (
  buffer: Buffer,
  width: number,
  height: number,
  folder: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: folder, width, height, crop: "fill" },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error);
          } else {
            if (result) {
              resolve(result);
            } else {
              reject(new Error("Upload response is undefined"));
            }
          }
        }
      )
      .end(buffer);
  });
};

const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
};

export { uploadImage, deleteImageFromCloudinary };
