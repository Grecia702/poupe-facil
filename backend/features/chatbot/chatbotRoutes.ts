import express from "express";
import * as chatbotController from "./chatbotController.ts";
import { authMiddleware } from '../../core/middleware/authMiddleware.ts';
const router = express.Router();

// router.post("/ocr", authMiddleware, gptController.processPromptOCR)
router.post("/", authMiddleware, chatbotController.promptBasic)

export default router
