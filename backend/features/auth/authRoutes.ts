import express from "express";
import { authMiddleware } from '../../core/middleware/authMiddleware.ts';
import { validateRefresh } from '../../core/middleware/verifyRefreshToken.ts';
import * as authController from './authController.ts'
import type { Request, Response } from "express";
const router = express.Router();

router.post("/login", authController.login);
router.post("/google", authController.googleLogin);
router.post("/signup", authController.signup);
router.post('/logout', validateRefresh, authController.logout);
router.post('/refresh', validateRefresh, authController.refresh);
router.get("/protected", authMiddleware, (req: Request, res: Response) => {
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

export default router
