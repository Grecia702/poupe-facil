const userModel = require("../models/userModel");
const bcrypt = require('bcrypt')
const saltRounds = 10;

const SignUp = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const searchUser = await userModel.FindUser(email);
        const uniqueEmail = searchUser.total === 0
        console.log(uniqueEmail)

        if (nome != '' && email != '' && senha != '') {
            if (!uniqueEmail) {
                console.log("email ja existe")
                return res.status(409).json({ message: 'Esse e-mail já está em uso!' });
            }
            const passwordHash = await bcrypt.hash(senha, saltRounds);
            userModel.CreateUser(nome, email, passwordHash)
            return res.status(201).json({ message: 'Usuário criado com sucesso!' });
        }
        else {
            console.log("Campos em branco");
            return res.status(400).json({ message: 'Campo(s) em branco' });
        }
    }
    catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        return res.status(500).json({ message: 'Erro ao cadastrar usuário', error: err.message });
    }
}

const deleteAccount = async (req, res) => {
    try {
        const { userId } = req.user.decoded;
        const { senha } = req.body
        const usuario = await userModel.ListUser(userId);
        const { senha: senhaHash } = usuario.firstResult
        const senhaValida = await bcrypt.compare(senha, senhaHash)
        if (usuario.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado" })
        }
        if (senhaValida) {
            await userModel.DeleteUser(userId);
            return res.status(204).json({ message: "Conta excluida com sucesso!" })
        }
        else {
            return res.status(401).json({ message: "Senha Invalida!" })
        }

    }
    catch (err) {
        console.log("Erro ao excluir a conta", err)
        return res.status(500).json({ message: "Erro ao excluir a conta, tente novamente mais tarde", error: err.message })
    }
}


module.exports = { SignUp, deleteAccount };