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
        // let image = cv.imread(imagePath);
        // let gray = image.bgrToGray();
        // let thresh = gray.threshold(0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
        // let contours = thresh.findContours(cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

        // if (contours.length === 0) {
        //     throw new Error('Nenhum contorno encontrado para cálculo do skew');
        // }
        // let maxContour = contours.reduce((max, c) => (c.area > max.area ? c : max), contours[0]);
        // let minRect = maxContour.minAreaRect();
        // let angle = minRect.angle;
        // if (angle < -45) {
        //     angle = 90 + angle;
        // }
        // const center = new cv.Point2(minRect.center.x, minRect.center.y);
        // const rotMat = cv.getRotationMatrix2D(center, angle, 1);

        // const rotated = image.warpAffine(
        //     rotMat,
        //     new cv.Size(image.cols, image.rows),
        //     cv.INTER_LINEAR,
        //     cv.BORDER_CONSTANT,
        //     new cv.Vec3(255, 255, 255)
        // );
        // const grayDeskewed = rotated.bgrToGray();
        // const blockSize = 15;
        // const C = 10;
        // const binaryDeskewed = grayDeskewed.adaptiveThreshold(
        //     255,
        //     cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        //     cv.THRESH_BINARY,
        //     blockSize,
        //     C
        // );
        // const deskewedPath = imagePath.replace(/\.(\w+)$/, '_deskewed_bin.$1');
        // cv.imwrite(deskewedPath, binaryDeskewed);
        const { data: { text } } = await Tesseract.recognize(imagePath, 'por');
        // fs.unlinkSync(deskewedPath);
        // fs.unlinkSync(imagePath);
        const data = await promptOCR(text)
        return res.status(200).json(data[0]);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao processar OCR', details: error.message });
    }
};

module.exports = { processImage };
