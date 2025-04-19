const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const accountController = require('../controller/accountController')
const logger = require('../utils/loggerConfig')

router.post("/account", authMiddleware, accountController.AddAccount)
router.delete("/account/delete", authMiddleware, accountController.RemoveAccount)
router.get("/account/list", authMiddleware, accountController.ListAccount)

module.exports = router
