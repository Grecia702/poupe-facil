const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const accountController = require('../controller/accountController')
const logger = require('../utils/loggerConfig')

router.post("/", authMiddleware, accountController.CreateAccount)
router.delete("", authMiddleware, accountController.RemoveAccount)
router.get("/", authMiddleware, accountController.ListAccount)
router.get("/:id", authMiddleware, accountController.FindAccount)

module.exports = router
