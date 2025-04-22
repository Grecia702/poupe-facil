require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const moment = require('moment');
const { Pool } = require('pg');
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const {
    verifyAccessToken,
    verifyRefreshToken,
    generateAccessToken
} = require('../utils/tokenUtils');

module.exports = async (req, res, next) => {
    try {
        let accessToken = req.cookies.accessToken;
        if (!accessToken && req.headers.authorization?.startsWith('Bearer ')) {
            accessToken = req.headers.authorization.split(' ')[1];
            console.log(accessToken)
        }

        if (!accessToken) {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ message: 'Sessão expirada. Faça login novamente.' });
            }

            const { valid, decoded } = verifyRefreshToken(refreshToken);
            if (!valid) {
                return res.status(401).json({ message: 'Refresh token inválido ou expirado' });
            }

            const agent = req.get('User-Agent')
            const { rows } = await pool.query('SELECT * FROM refresh_tokens WHERE token = $1 AND user_agent = $2', [refreshToken, agent]);
            if (rows.length === 0) {
                return res.status(401).json({ message: 'Refresh token não encontrado ou revogado' });
            }

            const newAccessToken = generateAccessToken({ userId: decoded.userId });
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });
            req.user = { userId: decoded.userId };
            console.log("Autenticação renovada")
            req.newAccessToken = newAccessToken;
            return next();
        }

        const result = verifyAccessToken(accessToken);
        if (result.valid) {
            req.user = result.decoded;
            console.log(req.headers.authorization)
            console.log("Autenticação persiste")
            return next();
        }
        else {
            return res.status(401).json({ message: 'Access token inválido ou expirado' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Possivel erro no sistema', error: error.message });
    }
};
