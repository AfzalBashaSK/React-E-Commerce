import {Request, Response} from "express";
import {validationResult} from 'express-validator';
import {IUser} from "../db/models/IUser";
import UsersTable from "../db/schemas/userSchema";
import bcryptjs from 'bcryptjs';
import gravatar from 'gravatar';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import UserRoutes from "../routes/userRoutes";
import * as ErrorUtil from "../util/ErrorUtil"
import { userUtil } from "../util/userUtil";

export interface UserPayload {
    id: string | undefined;
    email: string;
}

/**
 * @usage : Register a User
 * @method : POST
 * @url : http://localhost:9000/users/api/register
 * @access : PUBLIC
 * @param : username, email, password
 * @param request
 * @param response
 */
export const registerUser = async (request: Request, response: Response) => { 
    try {
        // read the form data
        const {username, email, password} = request.body;

        // check if the user is already exists
        const user: IUser | undefined | null = await UsersTable.findOne({email: email});
        if (user) {
            return response.status(401).json({msg: "User is already exists"});
        }
        // encrypt the password
        const salt = await bcryptjs.genSalt(11);
        const hashPassword = await bcryptjs.hash(password, salt);

        // get image url from Gravatar DB
        const imageUrl = gravatar.url(email, {s: '200', r: 'pg', d: 'mm'});

        // insert the data
        const theUser: IUser = {
            username: username,
            email: email,
            password: hashPassword,
            imageUrl: imageUrl,
        };
        const createdUser: IUser | undefined | null = await new UsersTable(theUser).save();
        if (createdUser) {
            return response.status(200).json({
                msg: "Registration is Success"
            })
        }
    } catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
    /* i can write response, error also but in catchErrors also then i have to change parameters order */
};

/**
 * @usage : Login a User
 * @method : POSt
 * @url : http://localhost:9000/users/api/login 
 * @access : PUBLIC
 * @param : email, password
 * @param request
 * @param response
 */
export const loginUser = async (request: Request, response: Response) => {
    try {
        // read the form data
        const {email, password} = request.body;

        // check if the email is exists
        const user: IUser | undefined | null = await UsersTable.findOne({email: email});
        if (!user) {
            return response.status(401).json({msg: "Invalid Credentials Email"});
        }

        // check / decode the password
        const isMatch: boolean = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return response.status(401).json({msg: "Invalid Credentials Password"});
        }

        // create a token
        const secretKey: string | undefined = process.env.EXPRESS_JWT_SECRET_KEY;
        const payload: { user: UserPayload } = {
            user: {
                id: user._id,
                email: user.email
            }
        }
        if (secretKey) {
            jwt.sign(payload, secretKey, {expiresIn: 100000000000, algorithm: 'HS256'}, (error, encoded) => {
                if (error) {
                    return response.status(401).json({msg: "Token creation is Failed!"});
                } else {
                    return response.status(200).json({
                        msg: "Login is Success",
                        token: encoded,
                        user: user
                    });
                }
            })
        }     
    } catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
};

/**
 * @usage : get User Info
 * @method : GET
 * @url : http://localhost:9000/users/api/me
 * @access : PRIVATE
 * @param : no-params
 * @param request 
 * @param response
 */
export const getUserInfo = async (request: Request, response: Response) => {
    try {
        const decodedToken: any = request.headers['user-info'];
        if (decodedToken) {
            const userId = decodedToken.id;
            const mongoUserId = new mongoose.Types.ObjectId(userId);
            const user: IUser | undefined | null = await UsersTable.findById(mongoUserId);
            if (user) {
                return response.status(200).json({user : user});
            }
        }
    } catch (error: any) {
        return response.status(500).json({
            msg: error.message
        });
    }
};

/**
 * @usage : updateProfilePicture
 * @param request 
 * @param response
 */

export const updateProfilePicture = async (request: Request, response: Response) => {
    try {

        let {imageUrl} = request.body // read image url from form
        const decodedToken: any = request.headers['user-info'];
        if (decodedToken) {
            const userId = decodedToken.id;
            const mongoUserId = new mongoose.Types.ObjectId(userId);
            const user: IUser | undefined | null | any = await UsersTable.findById(mongoUserId);
            if (user) {
                user.imageUrl = imageUrl;
                let userResponse = await user.save(); // Now this user is stroed in database
                if(userResponse){
                    return response.status(200).json({user : user});
                }   
            }
        }
    } catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
};


/**
 * @usage : Change the Password
 * @param request 
 * @param response
 */

/* export const changePassword = async (request: Request, response: Response) => {
    try {

        let {password} = request.body // read image url from form
        const decodedToken: any = request.headers['user-info'];
        if (decodedToken) {
            const userId = decodedToken.id;
            const mongoUserId = new mongoose.Types.ObjectId(userId);
            const user: IUser | undefined | null | any = await UsersTable.findById(mongoUserId);
            if (user) {
                // encrypt the password 
                const salt = await bcryptjs.genSalt(11);
                const hashPassword = await bcryptjs.hash(password, salt);
                user.passowrd = hashPassword;
                let userResponse = await user.save(); 
                // Now this user is stored in database that is th power of save function
                if(userResponse){
                    return response.status(200).json({
                        user : user,
                        msg : "Password is updated, Please Login Again"
                    });
                }   
            }
        }
    } catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
}; */

export const changePassword = async (request: Request, response: Response) => {
    try {

        let {password} = request.body 
        const salt = await bcryptjs.genSalt(11);
        const hashPassword = await bcryptjs.hash(password, salt);
        const user =await userUtil(request,response);  
        if (user) { 
            user.passowrd= hashPassword;
            const updatedUser = await user.save();
            if(updatedUser){
                return response.status(200).json({
                    user : user,
                    msg : "Password is updated, Please Login Again"
                });
            }   
        }
    } catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
};




