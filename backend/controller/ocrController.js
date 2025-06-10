const path = require('path');
const fs = require('fs');
const vision = require('@google-cloud/vision');
const { promptOCR } = require("../services/openaiService");
require('dotenv').config();

const client = new vision.ImageAnnotatorClient();

const processImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    try {
        const imagePath = path.resolve(req.file.path);
        const [result] = await client.textDetection(imagePath);
        const detections = result.textAnnotations;

        if (!detections || detections.length === 0) {
            fs.unlinkSync(imagePath);
            return res.status(200).json({ text: '', message: 'Nenhum texto encontrado' });
        }
        const text = detections[0].description;
        console.log(text);
        fs.unlinkSync(imagePath);
        const data = await promptOCR(text);
        return res.status(200).json(data[0]);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao processar OCR', details: error.message });
    }
};

module.exports = { processImage };
