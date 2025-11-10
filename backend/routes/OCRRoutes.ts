import express from "express";
import * as ocrController from "../controller/ocrController.ts";
import { authMiddleware } from '../middleware/authMiddleware.ts';
import type { Request, Response } from "express";

const router = express.Router();

router.post("/", authMiddleware, async (req: Request, res: Response) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ error: "No image provided" });

        const buffer = Buffer.from(image, "base64");
        const result = await ocrController.processImage(buffer);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Error processing image" });
    }
});

export default router
