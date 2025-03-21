const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");

router.post("/login", userController.Login)
router.post("/signup", userController.SignUp)

module.exports = router
