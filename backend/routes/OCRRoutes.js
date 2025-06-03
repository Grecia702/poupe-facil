const express = require("express");
const router = express.Router();
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const ocrController = require("../controller/ocrController");
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '.png');
    }
});

const upload = multer({ storage: storage });

router.post("/", authMiddleware, upload.single('image'), ocrController.processImage);

module.exports = router;
