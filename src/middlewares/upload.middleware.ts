import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// Ensure upload directories exist
const createUploadFolders = () => {
  const uploadDirs = ["uploads/images", "uploads/videos"];
  uploadDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Call function to create directories
createUploadFolders();

// Common function to generate unique filenames
const generateFileName = (file: Express.Multer.File) => {
  const timestamp = Date.now();
  const ext = path.extname(file.originalname);
  const name = path.basename(file.originalname, ext).replace(/\s+/g, "-");
  return `${name}-${timestamp}${ext}`;
};

// Storage configurations
const imageStorage = multer.diskStorage({
  destination: "uploads/images",
  filename: (req, file, cb) => cb(null, generateFileName(file)),
});

const videoStorage = multer.diskStorage({
  destination: "uploads/videos",
  filename: (req, file, cb) => cb(null, generateFileName(file)),
});

// File type validation
const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  allowedTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only images (jpg, png, gif) are allowed!"));
};

const videoFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["video/mp4", "video/avi", "video/mov", "video/mkv"];
  allowedTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only videos (mp4, avi, mov, mkv) are allowed!"));
};

// Multer upload middleware
export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFileFilter,
});

export const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: videoFileFilter,
});
