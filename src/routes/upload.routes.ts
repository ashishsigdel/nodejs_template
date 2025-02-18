import express from "express";
import { upload } from "../controllers/upload.controller";
import { uploadImage, uploadVideo } from "../middlewares/upload.middleware";

const router = express.Router();

router.route("/upload-image").post(uploadVideo.single("profile"), upload);

export default router;
