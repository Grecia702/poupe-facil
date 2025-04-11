const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const transacoesController = require("../controller/transacoesController");
const profileController = require("../controller/profileController");
const authMiddleware = require('../middleware/authMiddleware');
const accountController = require('../controller/accountController')
const logger = require('../utils/loggerConfig')

router.post("/login", userController.Login)
router.post("/signup", userController.SignUp)
router.get("/profile/:id", authMiddleware, profileController.SearchUser)

router.post("/profile/transaction", authMiddleware, transacoesController.AddTransaction)
router.delete("/profile/transaction/delete", authMiddleware, transacoesController.RemoveTransaction)
router.get("/profile/transaction/list", authMiddleware, transacoesController.ListarTransactions)

router.post("/profile/account", authMiddleware, accountController.AddAccount)
router.delete("/profile/account/delete", authMiddleware, accountController.RemoveAccount)

router.get("/profile/account/list", authMiddleware, accountController.ListAccount)
router.delete("/profile/:id", authMiddleware, userController.deleteAccount)

router.get("/protected", authMiddleware, (req, res) => {
    let clientIP = req.ip || req.connection.remoteAddress;
    if (clientIP === '::1') {
        clientIP = '127.0.0.1';
    }
    const agent = req.get('User-Agent')
    const host = req.get('Host')
    const ContentType = req.get('Content-Type')
    res.status(200).json({
        message: 'Você está autenticado:',
        clientIP: clientIP,
        userAgent: agent,
        host: host,
        ContentType: ContentType,
    });
});



module.exports = router
