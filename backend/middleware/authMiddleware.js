const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const {
    verifyAccessToken,
    verifyRefreshToken
} = require('../utils/tokenUtils');

module.exports = (req, res, next) => {
    let token = req.cookies.jwtToken;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido' });
    }
    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido', error: error.message });
    }
};
