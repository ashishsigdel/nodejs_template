import { Readable } from "stream";
import cloudinary from "../config/cloudinary";
import fs from "fs";

interface UploadFileParams {
  filePath: string;
  originalname: string;
  mimetype: string;
}

// Upload file to Cloudinary & delete local file after upload
export const uploadToCloudinary = async ({
  filePath,
  originalname,
  mimetype,
}: UploadFileParams): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload(
      filePath,
      {
        folder: "uploads",
        resource_type: "auto",
        public_id: originalname.split(".")[0],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || "");
        }

        // Delete local file after upload
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Failed to delete file: ${filePath}`, err);
        });
      }
    );
  });
};
