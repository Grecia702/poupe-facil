const express = require("express");
const router = express.Router();
const transactionController = require("../Controller/transactionController");
const authMiddleware = require('../middleware/authMiddleware');

router.post("/", authMiddleware, transactionController.AddTransaction)
router.get("/group", authMiddleware, transactionController.GroupTransactions)
router.get("/categories", authMiddleware, transactionController.GroupCategories)
router.get("/:id", authMiddleware, transactionController.ReadTransaction)
router.get("/", authMiddleware, transactionController.ListTransactions)
router.delete("/:id", authMiddleware, transactionController.RemoveTransaction)
router.patch("/:id", authMiddleware, transactionController.UpdateTransaction)

module.exports = router
