import {Request, Response} from "express";
import * as ErrorUtil from "../util/ErrorUtil"
import { userUtil } from "../util/userUtil";
import CartCollection from "../db/schemas/CartSchema";
import { ICart } from "../db/models/ICart";
import mongoose from "mongoose";

/**
 * Create a cart
 * @param request 
 * @param response 
 */
export const createCart = async(request: Request, response: Response)=>{
    try{
        const userObj = await userUtil(request,response);
        if(userObj){
            const {products,total,tax,grandTotal} = request.body;
            /* check if the user already have cart */
            const cart = await CartCollection.findOne({userObj: userObj._id});
            if(cart){
                await CartCollection.findOneAndDelete({userObj: userObj._id})
            }
            const newCart: ICart = {
                products: products,
                total: total,
                tax: tax,
                grandTotal: grandTotal,
                userObj: userObj._id
            }
            const theCart = await new CartCollection(newCart).save();
            if(!theCart){
                return response.status(400).json({msg: "Cart Creation is failed"});
            }
            const actualCart = await CartCollection.findById(new mongoose.Types.ObjectId(theCart._id)).populate({
                path: "products", /* Simple technique path should be key/field/column of newProduct */
                populate: {
                    path: "product" /* Simple technique path should be key/field/column of products */
                }
                ,strictPopulate: false
            }).populate({
                path: "userObj",
                strictPopulate: false
            })

            return response.status(200).json({
                msg:"Cart Creation is Success",
                cart: actualCart
            })
        }
    }
    catch(error){
        return ErrorUtil.catchErrors(error,response)
    }
}

/**
 * getCartInfo
 * @param request 
 * @param response 
 */
export const getCartInfo = async(request: Request, response: Response)=>{
    try{
        const userObj = await userUtil(request,response);
        if(userObj){
            const mongoUserId = new mongoose.Types.ObjectId(userObj._id);
            /* findById is applicable for MongoCartId not for MongoUserId because
             _id represents cartId where as userObj represents userId. so userObj value 
             is given by developer. where as _id is assigned by mongoose. so the value which
             is assigned mongoose is considered as actual ID and allows to use findById */
            const actualCart = await CartCollection.findOne({userObj : mongoUserId}).populate({
                path: "products", /* Simple technique path should be key/field/column of newProduct */
                populate: {
                    path: "product" /* Simple technique path should be key/field/column of products */
                }
                ,strictPopulate: false
            }).populate({
                path: "userObj",
                strictPopulate: false
            })

            return response.status(200).json(actualCart);
        }
    }
    catch(error){
        return ErrorUtil.catchErrors(error,response)
    }
}