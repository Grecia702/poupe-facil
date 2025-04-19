const userModel = require("../models/userModel");
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')
const moment = require('moment');


// const Login = async (req, res) => {
//     const { email, senha } = req.body;
//     try {
//         const usuarios = await userModel.ListUser(email);
//         const usuario = usuarios.total > 0 ? usuarios.firstResult : null

//         if (!usuario) {
//             return res.status(401).json({ message: 'E-mail e/ou senha incorretos!' });
//         }

//         const senhaValida = await bcrypt.compare(senha, usuario.senha)

//         if (senhaValida && usuario.email == email) {

//             const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");

//             console.log("login feito pelo usuario ", usuario.email, "durante as", timestamp, "horas")


//             const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

//             res.cookie('jwtToken', token, {
//                 httpOnly: true,
//                 secure: false,
//                 sameSite: 'None',
//                 maxAge: 2 * 60 * 60 * 1000,
//                 path: '/'
//             });
//             return res.status(200).json({
//                 token,
//                 message: 'Login bem-sucedido!'
//             });
//         }
//     }
//     catch (err) {
//         return res.status(500).json({ message: 'Erro ao processar a requisição', error: err.message });
//     }
// }

const SignUp = async (req, res) => {

    const { nome, email, senha, senhaRepeat } = req.body;
    const signUser = await userModel.FindUser(email);

    if (nome != '' && email != '' && senha != '' && senhaRepeat != '') {
        if (signUser.length > 0) {
            console.log("email ja existe")
            return res.status(401).json({ message: 'Esse e-mail já está em uso!' });
        }
        if (senha != senhaRepeat) {
            return res.status(400).json({ message: 'As senhas não coincidem' });
        }

        try {
            const passwordHash = await bcrypt.hash(senha, saltRounds);
            userModel.CreateUser(nome, email, passwordHash)
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

const deleteAccount = async (req, res) => {
    const { senha } = req.body;
    const userId = parseInt(req.params.id, 10);

    try {
        const usuario = await userModel.ListUser(userId);
        const senhaValida = await bcrypt.compare(senha, usuario[0].senha)

        if (usuario.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado" })
        }
        if (senhaValida) {
            await userModel.DeleteUser(userId);
            return res.status(200).json({ message: "Conta excluida com sucesso!" })
        }
        else {
            return res.status(401).json({ message: "Senha Invalida!" })
        }

    }
    catch (err) {
        console.log("Erro ao excluir a conta", err)
        return res.status(500).json({ message: "Erro ao excluir a conta, tente novamente mais tarde" })
    }
}


module.exports = { SignUp, deleteAccount };