const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const profileController = require("../Controller/profileController");
const authMiddleware = require('../middleware/authMiddleware');

router.post("/login", userController.Login)
router.post("/signup", userController.SignUp)
router.get("/profile/:id", profileController.SearchUser)
router.delete("/profile/:id", userController.deleteAccount)

router.get("/protected", authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Você está autenticado!' });
});

module.exports = router
