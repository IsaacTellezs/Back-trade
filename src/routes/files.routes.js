import { Router } from "express";
import multer from "multer";
import {  listFiles, uploadFile } from "../controllers/files.controllers.js";

const router = Router();

const upload = multer();

router.post("/upload", upload.single("file"), uploadFile);

router.get("/files", listFiles);


export default router;