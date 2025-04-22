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

module.exports = (req, res, next) => {
    let token = req.cookies.accessToken;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido' });
    }
    try {
        const decoded = verifyAccessToken(token);
        if (decoded.expired) {
            return res.status(401).json({ message: 'Token de acesso expirado' })
        }

        if (!decoded.valid) {
            return res.status(401).json({ message: 'Token de acesso invalido' })
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Token inválido', error: error.message });
    }
};

