const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const cloudinary = require('../cloudinary.js');
const { Readable } = require('stream');
const { getUserService, changePictureService } = require('../services/userService');

async function streamUpload(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'profile-pictures' },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        Readable.from(buffer).pipe(stream);
    });
}

const listProfile = async (req, res) => {
    try {
        const { userId } = req.user.decoded;
        const profile = await getUserService(userId);
        let picture;
        if (profile.picture_path) {
            picture = profile.picture_path;
        }
        return res.status(200).json({ ...profile, picture_path: picture });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const changeProfilePicture = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Nenhum arquivo enviado" });
        const uploadResult = await streamUpload(req.file.buffer);
        const imageUrl = uploadResult.secure_url;
        const { userId } = req.user.decoded;
        await changePictureService(imageUrl, userId);
        return res.status(200).json({ message: 'Foto de Perfil atualizada com sucesso', imageUrl });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(400).json({ error: error.message });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const { userId } = req.user.decoded;
        const { senha } = req.body;
        const usuario = await userModel.ListUser(userId);
        if (!usuario || usuario.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const { senha: senhaHash } = usuario.firstResult;
        const senhaValida = await bcrypt.compare(senha, senhaHash);

        if (senhaValida) {
            await userModel.deleteUser(userId);
            return res.status(204).json({ message: "Conta excluida com sucesso!" });
        } else {
            return res.status(401).json({ message: "Senha Inválida!" });
        }

    } catch (err) {
        console.log("Erro ao excluir a conta", err);
        return res.status(500).json({ message: "Erro ao excluir a conta, tente novamente mais tarde", error: err.message });
    }
};

module.exports = { listProfile, deleteAccount, changeProfilePicture };
