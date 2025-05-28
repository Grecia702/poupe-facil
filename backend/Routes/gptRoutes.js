const express = require("express");
const router = express.Router();
const gptController = require("../Controller/gptController");
const authMiddleware = require('../middleware/authMiddleware');

// router.post("/ocr", authMiddleware, gptController.processPromptOCR)
router.post("/", authMiddleware, gptController.promptBasic)

module.exports = router
