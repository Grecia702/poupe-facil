import *  as userModel from "../models/userModel.ts";
import type { Request, Response, NextFunction } from "express";

const SearchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const usuario = await userModel.ListUser(userId);
        res.status(200).json(usuario);
    }
    catch (error) {
        next(error)
    }
}

export { SearchUser };