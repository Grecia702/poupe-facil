import express from "express";
import * as userController from "./userController.ts";
import { authMiddleware } from '@core/middleware/authMiddleware.ts';
import type { Request, Response } from "express"
import fs from 'fs'
const router = express.Router();

// router.delete("/", authMiddleware, userController.deleteAccount)
router.get("/", authMiddleware, userController.listProfile)

router.post("/profile-picture", authMiddleware, async (req: Request, res: Response) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ error: 'No image provided' });
        const buffer = Buffer.from(image, 'base64');
        fs.writeFileSync('uploads/profile.jpg', buffer);

        res.json({ message: 'Profile picture updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error processing image' });
    }
});

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
