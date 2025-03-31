const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const transacoesController = require("../Controller/transacoesController");
const profileController = require("../Controller/profileController");
const authMiddleware = require('../middleware/authMiddleware');
const accountController = require('../Controller/accountController')

router.post("/login", userController.Login)
router.post("/signup", userController.SignUp)
router.get("/profile/:id", authMiddleware, profileController.SearchUser)

router.post("/profile/transaction", authMiddleware, transacoesController.AddTransaction)
router.delete("/profile/transaction/delete", authMiddleware, transacoesController.RemoveTransaction)
router.get("/profile/transaction/list", authMiddleware, transacoesController.ListarTransactions)

router.post("/profile/account", authMiddleware, accountController.AddAccount)
router.delete("/profile/account/delete", accountController.RemoveAccount)

router.get("/profile/account/list", authMiddleware, accountController.ListAccount)
router.delete("/profile/:id", userController.deleteAccount)

router.get("/protected", authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Você está autenticado!' });
});

module.exports = router
