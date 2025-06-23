const express = require("express");
const router = express.Router();
const multer = require('multer');
const ocrController = require("../controller/ocrController");
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authMiddleware, upload.single('image'), ocrController.processImage);

module.exports = router;
