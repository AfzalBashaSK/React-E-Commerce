import {Response, Request} from "express";
import mongoose from "mongoose";
import {IUser} from "../db/models/IUser";
import UsersTable from "../db/schemas/userSchema";

export const UserValidationUtil = async (request: Request, response: Response): Promise<IUser | any> => {
    try {
        const decodedToken: any = request.headers['user-info'];
        if (decodedToken) {
            const userId = decodedToken.id;
            if (!userId) {
                return response.status(401).json({msg: "No User Found"})
            }
            const mongoUserId = new mongoose.Types.ObjectId(userId);
            const user: IUser | undefined | null = await UsersTable.findById(mongoUserId);
            if (!user) {
                return response.status(404).json({msg: "No User Exists in DB"})
            }
            return user;
        }
    } catch (e) {
        return response.status(500).json({msg: "User Validation failed"})
    }
};