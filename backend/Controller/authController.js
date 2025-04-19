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
        if (!usuario) {
            return res.status(401).json({ message: 'E-mail e/ou senha incorretos!' });
        }
        const senhaValida = await bcrypt.compare(senha, usuario.senha)
        if (senhaValida && usuario.email == email) {
            const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");

            console.log("login feito pelo usuario ", usuario.email, "durante as", timestamp, "horas")
            const payload = {
                userId: usuario.id,
            };
            const { userId } = payload
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await pool.query('INSERT INTO refresh_tokens (usuario_id, token, expires_at) VALUES ($1, $2, $3)', [userId, refreshToken, expiresAt]);
            res.cookie('jwtToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });
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

    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(403).json({ message: 'Cookie invalido' });
    }

    const result = await pool.query('SELECT * FROM refresh_tokens WHERE token = $1', [refreshToken]);
    if (result.rowCount === 0) {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken({ userId: decoded.userId });

        res.cookie('jwtToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({ message: 'Cookie gerado com sucesso' });

    } catch (err) {
        return res.sendStatus(403);
    }
};

const logout = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(404).json({ message: 'Token ausente na requisição' });
    }
    try {
        const { rowCount } = await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken])
        if (rowCount === 0) {
            return res.status(404).json({ message: 'Token não encontrado' });
        }
        else {
            res.clearCookie('jwtToken');
            return res.status(200).json({ message: 'Token apagado com sucesso' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Erro inesperado ao fazer logout', error: err.message });
    }
};

module.exports = {
    login,
    refresh,
    logout
};
