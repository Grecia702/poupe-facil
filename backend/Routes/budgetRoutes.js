const express = require("express");
const router = express.Router();
const budgetController = require("../Controller/budgetController");
const authMiddleware = require('../middleware/authMiddleware');

router.post("/", authMiddleware, budgetController.createBudget)
router.get("/list", authMiddleware, budgetController.getBudgets)
router.get("/activated", authMiddleware, budgetController.getActiveBudget)
router.get("/:id", authMiddleware, budgetController.getBudgetById)
router.patch("/:id", authMiddleware, budgetController.updateBudget)
router.delete("/:id", authMiddleware, budgetController.deleteBudget)


module.exports = router
