const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const financialReportController = require('../controller/financial-report-controller');
const router = express.Router();

router.get("/", authMiddleware, financialReportController.getReport)
router.get("/:id", authMiddleware, financialReportController.getReportByID)

module.exports = router