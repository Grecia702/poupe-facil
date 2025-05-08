const express = require("express");
const router = express.Router();
const transactionController = require("../Controller/transactionController");
const authMiddleware = require('../middleware/authMiddleware');

router.post("/", authMiddleware, transactionController.addTransaction)
router.get("/group", authMiddleware, transactionController.groupTransactions)
router.get("/categories", authMiddleware, transactionController.groupCategories)
router.get("/summary", authMiddleware, transactionController.transactionSummary)
router.get("/:id", authMiddleware, transactionController.readTransaction)
router.get("/", authMiddleware, transactionController.listTransactions)
router.delete("/:id", authMiddleware, transactionController.removeTransaction)
router.patch("/:id", authMiddleware, transactionController.updateTransaction)

module.exports = router
