import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { uploadToCloudinary } from "../utils/fileUpload";
import path from "path";

export const upload = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded" });
  }

  try {
    const filePath = path.resolve(req.file.path);
    const imageUrl = await uploadToCloudinary({
      filePath,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
    });

    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed", error });
  }
});
