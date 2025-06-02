const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');
const cv = require('opencv4nodejs');
const { promptOCR } = require("../services/openaiService");

const processImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }
    try {
        const imagePath = path.resolve(req.file.path);

        const { data: { text } } = await Tesseract.recognize(imagePath, 'por');
        console.log(text)
        fs.unlinkSync(imagePath);
        const data = await promptOCR(text)
        return res.status(200).json(data[0]);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao processar OCR', details: error.message });
    }
};

module.exports = { processImage };
