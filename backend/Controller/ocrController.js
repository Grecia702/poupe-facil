const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');
const { promptOCR } = require("../services/openaiService");

const processImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    try {
        const imagePath = path.resolve(req.file.path);

        const { data: { text } } = await Tesseract.recognize(
            imagePath,
            'por',
        );

        fs.unlinkSync(imagePath);
        const data = await promptOCR({ text })
        return res.status(200).json({ data });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar OCR', details: error.message });
    }
};

module.exports = { processImage }