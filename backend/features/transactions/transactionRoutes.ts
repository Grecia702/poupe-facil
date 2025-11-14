import express from "express";
import * as transactionController from "./transactionController.ts";
import { authMiddleware } from '@core/middleware/authMiddleware.ts';
import { errorHandler } from "@core/middleware/errorHandler.ts";
const router = express.Router();

router.post("/many", authMiddleware, transactionController.createManyTransaction)
router.post("/", authMiddleware, transactionController.createTransaction)
router.get("/types", authMiddleware, transactionController.groupTransactionsByType)
router.get("/categories", authMiddleware, transactionController.groupCategories)
router.get("/summary", authMiddleware, transactionController.transactionSummary)
router.get("/:id", errorHandler, authMiddleware, transactionController.readTransaction)
router.get("/", authMiddleware, transactionController.listTransactions)
router.delete("/:id", authMiddleware, transactionController.removeTransaction)
router.patch("/:id", authMiddleware, transactionController.updateTransaction)

export default router
