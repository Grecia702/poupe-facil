import express from "express";
import { authMiddleware } from '../middleware/authMiddleware.ts';
import * as accountController from '../controller/accountController.ts'
const router = express.Router();

router.post("/", authMiddleware, accountController.CreateAccount)
router.delete("/:id", authMiddleware, accountController.RemoveAccount)
router.patch("/:id", authMiddleware, accountController.UpdateAccount)
router.get("/total", authMiddleware, accountController.sumAccountController)
router.get("/", authMiddleware, accountController.ListAccount)
router.get("/:id", authMiddleware, accountController.FindAccountByID)

export default router