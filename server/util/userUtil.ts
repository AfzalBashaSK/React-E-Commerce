import { Request,Response } from "express"
import mongoose from "mongoose";
import UsersTable from "../db/schemas/userSchema";
import { catchErrors } from "./ErrorUtil";
import { IUser } from "../db/models/IUser";

export const userUtil= async (request:Request,response:Response):Promise<IUser | undefined | null | any>=>{
    try{
        const decodedToken: any = request.headers['user-info'];
        if (decodedToken) {
            const userId = decodedToken.id;
            const mongoUserId = new mongoose.Types.ObjectId(userId);
            const user: IUser | undefined | null = await UsersTable.findById(mongoUserId);
            if (user) {
                return user;
            }
        }
    }
    catch(error){
        return catchErrors(request,response)
    }
}