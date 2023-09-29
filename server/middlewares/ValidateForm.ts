import { Response,Request,NextFunction } from "express"
import { validationResult } from "express-validator";
import { APP_CONSTANTS } from "../constants";

export const  ValidateForm = async (request:Request,response: Response,next:NextFunction)=>{
    const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                msg: errors.array().map(error => error.msg).join("\n"),
                data: null,
                status: APP_CONSTANTS.FAILED
        })                
    }
    next();
}

export const  validateForm = async (request:Request,response: Response,next:NextFunction)=>{
    const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                msg: errors.array().map(error => error.msg).join("\n"),
                data: null,
                status: APP_CONSTANTS.FAILED
        })                
    }
    next();
}