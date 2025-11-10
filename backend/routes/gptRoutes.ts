import express from "express";
import * as gptController from "../controller/gptController.ts";
import { authMiddleware } from '../middleware/authMiddleware.ts';
const router = express.Router();

// router.post("/ocr", authMiddleware, gptController.processPromptOCR)
router.post("/", authMiddleware, gptController.promptBasic)

export default router
