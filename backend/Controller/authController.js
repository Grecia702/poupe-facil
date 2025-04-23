require('dotenv').config();
const userModel = require("../models/userModel");
const { Pool } = require('pg');
const bcrypt = require('bcrypt')
const moment = require('moment');
const logger = require('../utils/loggerConfig')

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');
const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");

// LOGIN
const login = async (req, res) => {
    const { email, senha } = req.body;
    const agent = req.get('User-Agent')
    try {
        const usuarios = await userModel.FindUser(email);
        const usuario = usuarios.total > 0 ? usuarios.firstResult : null
        const senhaValida = await bcrypt.compare(senha, usuario.senha)

        if (!usuario) {
            return res.status(401).json({ message: 'E-mail e/ou senha incorretos!' });
        }
        if (senhaValida && usuario.email == email) {
            console.log("login feito pelo usuario ", usuario.email, "durante as", timestamp, "horas")
            const payload = {
                userId: usuario.id,
            };
            const { userId } = payload
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await pool.query('INSERT INTO refresh_tokens (usuario_id, token, user_agent, expires_at) VALUES ($1, $2, $3, $4)', [userId, refreshToken, agent, expiresAt]);
            logger.info(`Login feito pelo usuário de ID ${userId} as ${timestamp}. IP: ${req.ip}, User Agent: ${agent}`)
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
    const { userId } = req.user.decoded;
    const agent = req.get('User-Agent')
    const payload = {
        userId: userId,
    };
    const newAccessToken = generateAccessToken(payload);
    console.log("Token renovado com sucesso às", timestamp);
    logger.info(`Renovação de token feita pelo usuario ${userId} durante as ${timestamp}. IP: ${req.ip}, User-Agent: ${agent}`);
    return res.status(200).json({ message: 'Token renovado com sucesso', newAccessToken });
};


const logout = async (req, res) => {
    const refreshToken = req.headers.authorization.split(' ')[1];
    const { userId } = req.user.decoded;
    const agent = req.get('User-Agent')

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
            console.log('Logout feito pelo usuário', userId)
            logger.info(`Logout feito pelo usuário de ID ${userId} as ${timestamp}. IP: ${req.ip}, User Agent: ${agent}`)
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
