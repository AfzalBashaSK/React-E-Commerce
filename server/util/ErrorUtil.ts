import { Response } from "express";
import { APP_CONSTANTS } from "../constants";

export const catchErrors = (error:any,response: Response)=>{
    console.log(error)
    return response.status(500).json({
        msg: " Server Error",
        data: null,
        status: APP_CONSTANTS.FAILED
    })
}