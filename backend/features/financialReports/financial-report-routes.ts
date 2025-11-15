import express from 'express';
import { authMiddleware } from '../../core/middleware/authMiddleware.ts';
import * as financialReportController from './financial-report-controller.ts';
const router = express.Router();

router.get("/", authMiddleware, financialReportController.getReport)
router.get("/:id", authMiddleware, financialReportController.getReportByID)

export default router