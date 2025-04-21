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
    // console.log(req.body)
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

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 1 * 60 * 1000
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
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


// const refresh = async (req, res) => {
//     let refreshToken = req.cookies.refreshToken;
//     // console.log(refreshToken)
//     if (!refreshToken) {
//         return res.status(403).json({ message: 'Cookie invalido' });
//     }
//     const result = await pool.query('SELECT * FROM refresh_tokens WHERE token = $1', [refreshToken]);
//     if (result.rowCount === 0) {
//         return res.status(403).json({ message: 'Access denied' });
//     }

//     try {
//         const decoded = verifyRefreshToken(refreshToken);
//         const newAccessToken = generateAccessToken({ userId: decoded.userId });
//         res.cookie('jwtToken', newAccessToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'strict',
//             maxAge: 15 * 60 * 1000
//         });

//         res.status(200).json({ message: 'Cookie gerado com sucesso' });
//     } catch (err) {
//         return res.status(403).json({ message: "Erro", error: err.message });
//     }
// };

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
    logout
};
