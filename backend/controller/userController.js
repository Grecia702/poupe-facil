const userModel = require("../models/userModel");
const bcrypt = require('bcrypt')
const path = require('path');
const { getUserService, changePictureService } = require('../services/userService')

const listProfile = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const profile = await getUserService(userId)
        let picture;
        if (profile.picture_path) {
            picture = req.protocol + '://' + req.get('host') + req.originalUrl + profile.picture_path
        }
        return res.status(200).json({ ...profile, picture_path: picture })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

const changeProfilePicture = async (req, res) => {
    try {
        const normalizedPath = req.file.path.replace(/\\/g, '/');
        const { userId } = req.user.decoded
        await changePictureService(normalizedPath, userId)
        return res.status(200).json({ message: 'Foto de Perfil atualizada com sucesso' })
    } catch (error) {
        return res.status(400).json({ error: error.message })
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


module.exports = { listProfile, deleteAccount, changeProfilePicture };