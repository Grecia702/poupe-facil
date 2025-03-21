const userModel = require("../Model/userModel");
const bcrypt = require('bcrypt')
const saltRounds = 10;

const Login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const find = await userModel.FindUser(email);
        if (find.email != email) {
            console.log("email não encontrado")
            return res.status(401).json({ message: 'E-mail e/ou senha incorretos!' });
        }
        const compare = await bcrypt.compare(senha, find.senha)
        if (compare) {
            console.log("login feito com sucesso")
            return res.status(200).json({ message: 'Login bem-sucedido!' });
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
    const find = await userModel.FindUser(email);

    if (typeof find != 'undefined') {
        console.log("email ja existe")
        return res.status(401).json({ message: 'Esse e-mail já está em uso!' });
    }
    if (senha != senhaRepeat) {
        return res.status(400).json({ message: 'As senhas são diferentes' });
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
}

module.exports = { Login, SignUp };