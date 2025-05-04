const express = require("express");
const router = express.Router();
const transacoesController = require("../Controller/transacoesController");
const authMiddleware = require('../middleware/authMiddleware');

router.post("/", authMiddleware, transacoesController.AddTransaction)
router.get("/group", authMiddleware, transacoesController.AgruparTransacoes)
router.get("/:id", authMiddleware, transacoesController.ReadTransaction)
router.get("/", authMiddleware, transacoesController.ListarTransactions)
router.delete("/:id", authMiddleware, transacoesController.RemoveTransaction)
router.patch("/:id", authMiddleware, transacoesController.UpdateTransaction)

module.exports = router
