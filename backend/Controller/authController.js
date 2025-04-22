require('dotenv').config();
const userModel = require("../models/userModel");
const { Pool } = require('pg');
const bcrypt = require('bcrypt')
const moment = require('moment');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} = require('../utils/tokenUtils');

// LOGIN
const login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuarios = await userModel.ListUser(email);
        const usuario = usuarios.total > 0 ? usuarios.firstResult : null
        const senhaValida = await bcrypt.compare(senha, usuario.senha)

        if (!usuario) {
            return res.status(401).json({ message: 'E-mail e/ou senha incorretos!' });
        }
        if (senhaValida && usuario.email == email) {
            const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
            console.log("login feito pelo usuario ", usuario.email, "durante as", timestamp, "horas")
            const payload = {
                userId: usuario.id,
            };
            const { userId } = payload
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            const agent = req.get('User-Agent')
            await pool.query('INSERT INTO refresh_tokens (usuario_id, token, user_agent, expires_at) VALUES ($1, $2, $3, $4)', [userId, refreshToken, agent, expiresAt]);
            return res.status(200).json({
                accessToken,
                refreshToken,
                message: 'Login bem-sucedido!'
            });

        } else {
            return res.status(401).json({ message: 'E-mail e/ou senha incorretos!' });
        }
    }
    catch (err) {
        return res.status(500).json({ message: 'Erro ao processar a requisição', error: err.message });
    }
};


const refresh = async (req, res) => {
    if (req.headers.authorization?.startsWith('Bearer ')) {
        const refreshToken = req.headers.authorization.split(' ')[1];
        const userAgent = req.get('User-Agent')
        const result = await pool.query('SELECT * FROM refresh_tokens WHERE token = $1', [refreshToken]);
        const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
        if (result.rowCount === 0) {
            return res.status(401).setHeader('Content-Type', 'application/json').json({ message: 'Refresh token não existe' });
        }
        try {
            const { valid, expired, decoded } = verifyRefreshToken(refreshToken);

            if (expired) {
                await pool.query('DELETE FROM refresh_tokens WHERE token = $1 ', [refreshToken]);
                console.log("token invalidado as", timestamp)
                return res.status(401).json({ message: 'Refresh token expirado, faça login novamente' });
            }

            if (!valid) {
                return res.status(403).json({ message: 'Refresh token inválido' });
            }
            const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
            const newAccessToken = generateAccessToken({ userId: decoded.userId });
            console.log("Token renovado com sucesso as", timestamp)
            return res.status(200).json({ message: 'Token renovado com sucesso', newAccessToken });
        } catch (err) {
            return res.status(500).json({ message: "Erro ao validar token", error: err.message });
        }
    }
    else {
        return res.status(401).json({ message: 'Token invalido' });
    }
};

const logout = async (req, res) => {
    let refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Token ausente na requisição' });
    }
    try {
        const { rowCount } = await pool.query('SELECT * FROM refresh_tokens WHERE token = $1', [refreshToken])
        if (rowCount === 0) {
            return res.status(404).json({ message: 'Token não encontrado' });
        }
        else {
            await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken])
            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            return res.status(200).json({ message: 'Token apagado com sucesso' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Erro inesperado ao fazer logout', error: err.message });
    }
};

module.exports = {
    login,
    logout,
    refresh
};
