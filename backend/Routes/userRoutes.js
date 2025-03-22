const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const authMiddleware = require('../middleware/authMiddleware');

router.post("/login", userController.Login)
router.post("/signup", userController.SignUp)


router.get("/protected", authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Você está autenticado!' });
});

module.exports = router
