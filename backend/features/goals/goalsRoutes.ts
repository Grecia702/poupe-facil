import express from "express";
import * as goalsController from "./goalsController.ts";
import { authMiddleware } from '@core/middleware/authMiddleware.ts';
const router = express.Router();

router.post("/", authMiddleware, goalsController.createGoal)
router.get("/", authMiddleware, goalsController.getGoals)
router.get("/:id", authMiddleware, goalsController.getGoalById)
router.patch("/saldo/:id", authMiddleware, goalsController.updateSaldo)
router.patch("/:id", authMiddleware, goalsController.updateGoal)
router.delete("/:id", authMiddleware, goalsController.deleteGoal)


export default router
