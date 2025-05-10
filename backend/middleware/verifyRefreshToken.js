require('dotenv').config();
const pool = require('../db.js')
const authModel = require("../models/authModel");

const { verifyRefreshToken } = require('../Utils/tokenUtils');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Refresh token não enviado' });
        }
        const refreshToken = authHeader.split(' ')[1];
        const userAgent = req.get('User-Agent');
        const ipAddress = req.ip;
        const decoded = verifyRefreshToken(refreshToken);
        req.user = decoded;
        req.refreshToken = refreshToken;
        const { userId } = req.user.decoded;
        const token = await authModel.getToken(refreshToken, userId, userAgent, ipAddress)
        if (!token.exists) {
            return res.status(401).json({ message: 'Refresh token não existe' });
        }
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            const authHeader = req.headers.authorization;
            const refreshToken = authHeader.split(' ')[1];
            await authModel.deleteToken(refreshToken)
            return res.status(401).json({ message: 'Refresh token expirado' });
        }
        return res.status(403).json({ message: 'Refresh token inválido' });
    }
};
