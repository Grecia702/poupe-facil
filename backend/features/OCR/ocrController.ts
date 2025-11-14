import vision from '@google-cloud/vision';
import { promptOCR } from "./openaiService.ts";
import type { NextFunction } from 'express';

const client = new vision.ImageAnnotatorClient();

const processImage = async (buffer: Buffer, next: NextFunction) => {
    try {
        const [result] = await client.textDetection({ image: { content: buffer } });
        const detections = result.textAnnotations;
        if (!detections || detections.length === 0) {
            return { text: '', message: 'Nenhum texto encontrado' };
        }
        const text = detections[0].description;
        const data = await promptOCR(text);
        return data[0];
    } catch (error) {
        next(error)
    }
};

export { processImage };
