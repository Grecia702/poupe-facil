const userModel = require("../Model/userModel");
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const Login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await userModel.FindUser(email);
        const senhaValida = await bcrypt.compare(senha, usuario.senha)

        if (usuario.email != email) {
            console.log("email não encontrado")
            return res.status(401).json({ message: 'E-mail e/ou senha incorretos!' });
        }

        if (senhaValida) {
            console.log("login feito com sucesso :", usuario.id)
            const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

            res.cookie('jwtToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 2 * 60 * 60 * 1000
            });
            return res.status(200).json({
                token,
                message: 'Login bem-sucedido!'
            });
        } else {
            return res.status(401).json({ message: 'E-mail e/ou senha incorretos!' });
        }
    }
    catch (err) {
        return res.status(500).json({ message: 'Erro ao processar a requisição', error: err.message });
    }
}

const SignUp = async (req, res) => {

    const { nome, email, senha, senhaRepeat } = req.body;
    const findUser = await userModel.FindUser(email);
    console.log(typeof nome)
    if (nome != '' && email != '' && senha != '' && senhaRepeat != '') {
        if (typeof findUser != 'undefined') {
            console.log("email ja existe")
            return res.status(401).json({ message: 'Esse e-mail já está em uso!' });
        }
        if (senha != senhaRepeat) {
            return res.status(400).json({ message: 'As senhas não coincidem' });
        }

        try {
            const hash = await bcrypt.hash(senha, saltRounds);
            console.log("hash gerado: ", hash)
            userModel.CreateUser(nome, email, hash)
            return res.json({ message: 'Usuário criado com sucesso!' });
        }
        catch (err) {
            console.error('Erro ao inserir dados:', err);
            return res.status(500).json({ message: 'Erro ao cadastrar usuário', error: err.message });
        }
    } else {
        console.log("Campo em branco")
        return res.status(400).json({ message: 'Campo em branco' });
    }
}


module.exports = { Login, SignUp };