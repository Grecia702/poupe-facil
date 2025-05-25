const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const accountController = require('../Controller/accountController')

router.post("/", authMiddleware, accountController.CreateAccount)
router.delete("/:id", authMiddleware, accountController.RemoveAccount)
router.get("/total", authMiddleware, accountController.sumAccountController)
router.get("/", authMiddleware, accountController.ListAccount)
router.get("/:id", authMiddleware, accountController.FindAccountByID)



module.exports = router