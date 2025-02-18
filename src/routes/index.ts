import express from "express";

import authRoute from "./auth.routes";
import uploadRoute from "./upload.routes";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/upload", uploadRoute);

export default router;
