import * as userModel from "./userModel.ts";
import bcrypt from 'bcrypt';
import cloudinary from '../../core/config/cloudinary.ts';
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';
import { getUserService, changePictureService } from './userService.ts';
import type { Request, Response } from "express";

async function streamUpload(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'profile-pictures' },
            (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        Readable.from(buffer).pipe(stream);
    });
}

const listProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as any).user;
        const profile = await getUserService(userId);
        let picture;
        if (profile.picture_path) {
            picture = profile.picture_path;
        }
        return res.status(200).json({ ...profile, picture_path: picture });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
    }
};

const changeProfilePicture = async (req: Request, res: Response) => {
    try {
        if (!(req as any).file) return res.status(400).json({ message: "Nenhum arquivo enviado" });
        const uploadResult = await streamUpload((req as any).file.buffer);
        const imageUrl = uploadResult.secure_url;
        const { userId } = (req as any).user;
        await changePictureService(imageUrl, userId);
        return res.status(200).json({ message: 'Foto de Perfil atualizada com sucesso', imageUrl });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Upload error:', error);
            return res.status(400).json({ error: error.message });
        }
    }
};

// const deleteAccount = async (req: Request, res: Response) => {
//     try {
//         const { userId } = (req as any).user;
//         const { senha } = req.body;
//         const usuario = await userModel.ListUser(userId);
//         if (!usuario || usuario.length === 0) {
//             return res.status(404).json({ message: "Usuário não encontrado" });
//         }

//         const { senha: senhaHash } = usuario.firstResult;
//         const senhaValida = await bcrypt.compare(senha, senhaHash);

//         if (senhaValida) {
//             await userModel.deleteUser(userId);
//             return res.status(204).json({ message: "Conta excluida com sucesso!" });
//         } else {
//             return res.status(401).json({ message: "Senha Inválida!" });
//         }

//     } catch (err) {
//         if (err instanceof Error) {
//             console.log("Erro ao excluir a conta", err);
//             return res.status(500).json({ message: "Erro ao excluir a conta, tente novamente mais tarde", error: err.message });
//         }
//     }
// };

export { listProfile, changeProfilePicture };
