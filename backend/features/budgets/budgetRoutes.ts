import express from "express";
import * as budgetController from "./budgetController.ts";
import { authMiddleware } from '../../core/middleware/authMiddleware.ts';
const router = express.Router();

router.post("/", authMiddleware, budgetController.createBudget)
router.get("/", authMiddleware, budgetController.getBudgets)
router.get("/activated", authMiddleware, budgetController.getActiveBudget)
router.get("/:id", authMiddleware, budgetController.getBudgetById)
router.patch("/:id", authMiddleware, budgetController.updateBudget)
router.delete("/:id", authMiddleware, budgetController.deleteBudget)


export default router
