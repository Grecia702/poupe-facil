require('dotenv').config();
const logger = require('../Utils/loggerConfig')
const { generateAccessToken } = require('../Utils/tokenUtils');
const { loginService, googleService, signupService, logoutService } = require('../services/authService.js');
const { format } = require('date-fns');
const date = format(new Date(), 'dd/MM/yyyy HH:mm:ss');;

// LOGIN
const login = async (req, res) => {
    try {
        const agent = req.get('User-Agent')
        const userIp = req.ip
        const query = req.body
        const authToken = await loginService(query, agent, userIp)
        return res.status(200).json(authToken);
    }
    catch (err) {
        if (err.message === 'E-mail e/ou senha incorretos!') {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: 'Erro ao processar a requisição', error: err.message });
    }
};


const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body
        const userAgent = req.get('User-Agent')
        const userIp = req.ip
        const authToken = await googleService(idToken, userAgent, userIp)
        return res.status(200).json(authToken);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: 'Erro ao processar a requisição', error: error.message });

    }
}


const refresh = async (req, res) => {
    const { userId } = req.user.decoded;
    const userAgent = req.get('User-Agent')
    const ipAddress = req.ip
    const payload = {
        userId: userId,
    };
    const newAccessToken = generateAccessToken(payload);
    console.log("Token renovado com sucesso às", date);
    logger.info(`Renovação de token feita pelo usuario ${userId} durante as ${date}. IP: ${ipAddress}, User-Agent: ${userAgent}`);
    return res.status(200).json({ message: 'Token renovado com sucesso', newAccessToken });
};

const signup = async (req, res) => {
    try {
        const query = req.body;
        await signupService(query)
        return res.status(201).json({ message: 'Cadastro realizado com sucesso' })
    }
    catch (err) {
        if (err.message === "Já existe uma conta com este e-mail") {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: 'Erro ao cadastrar usuário', error: err.message });
    }
}

const logout = async (req, res) => {
    try {
        const refreshToken = req.headers.authorization.split(' ')[1];
        const { userId } = req.user.decoded;
        const ipAddress = req.ip
        const userAgent = req.get('User-Agent')
        await logoutService(refreshToken, userId, userAgent, ipAddress)
        return res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (err) {
        return res.status(500).json({ message: 'Erro inesperado ao fazer logout', error: err.message });
    }
};

module.exports = {
    login,
    googleLogin,
    logout,
    refresh,
    signup
};
