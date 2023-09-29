import {Request, Response} from "express";
import * as ErrorUtil from "../util/ErrorUtil"
import { userUtil } from "../util/userUtil";
import { IOrder } from "../db/models/IOrder";
import OrderCollection from "../db/schemas/OrderSchema";
import mongoose from "mongoose";

/**
 * Place an Order
 * @param request 
 * @param response 
 */
export const placeOrder = async(request: Request, response: Response)=>{
    try{
        const userObj = await userUtil(request,response);
        if(userObj){
            const {products,total,tax,grandTotal, paymentType} = request.body;
            const newOrder : IOrder = {
                products : products,
                total: total,
                tax: tax,
                grandTotal: grandTotal,
                paymentType: paymentType,
                orderBy: userObj._id
            }
            const theOrder = await new OrderCollection(newOrder).save();
            if(!theOrder){
                return response.status(400).json({msg : "Order Creation Failed"})
            }
            if(theOrder){
                const theActualOrder = await OrderCollection.findById(new mongoose.Types.ObjectId(theOrder._id)).populate({
                    path: "products", /* Simple technique path should be key/field/column of theOrder */
                    populate: {
                        path: "product" /* Simple technique path should be key/field/column of products */
                    }
                    ,strictPopulate: false
                }).populate({
                    path: "orderBy",
                    strictPopulate: false
                });
                return response.status(200).json({msg : "Order is placed successfully",order : theActualOrder})                
            }
        }
    }
    catch(error){
        return ErrorUtil.catchErrors(error,response)
    }
}

/**
 * getAllOrders
 * @param request 
 * @param response 
 */
export const getAllOrders = async(request: Request, response: Response)=>{
    try{
        const userObj = await userUtil(request,response);
        if(userObj){
            const orders = await OrderCollection.find().sort("-createdAt").populate({
                path: "products", 
                populate: {
                    path: "product" 
                }
                ,strictPopulate: false
            }).populate({
                path: "orderBy",
                strictPopulate: false
            });
            return response.status(200).json(orders);
        }
    }
    catch(error){
        return ErrorUtil.catchErrors(error,response)
    }
}

/**
 * getAllOrders
 * @param request 
 * @param response 
 */
export const getMyOrders = async(request: Request, response: Response)=>{
    try{
        const userObj = await userUtil(request,response);
        if(userObj){
            const mongoUserId = new mongoose.Types.ObjectId(userObj._id)
            /* createdAt displays orders like first,second,third orders but we want to
                see the latest/ third order in top of the last instead of last.
                so -createdAt will displays the orders in this way.
                simply -createdAt is like stack if any order comes it is displayed first */
            const orders = await OrderCollection.find({orderBy: mongoUserId}).sort("-createdAt").populate({
                path: "products", 
                populate: {
                    path: "product" 
                }
                ,strictPopulate: false
            }).populate({
                path: "orderBy",
                strictPopulate: false
            });
            return response.status(200).json(orders);
        }
    }
    catch(error){
        return ErrorUtil.catchErrors(error,response)
    }
}

/**
 * updateOrderStatus
 * @param request 
 * @param response 
 */
export const updateOrderStatus = async(request: Request, response: Response)=>{
    try{
        const {orderId} = request.params;
        const mongoOrderId = new mongoose.Types.ObjectId(orderId)
        const userObj = await userUtil(request,response);
        if(userObj){
            const {orderStatus} = request.body
            const orderObj = await OrderCollection.findById(mongoOrderId);
            if(!orderObj){
                return response.status(400).json({msg : "No Order Found"})
            }
            /* const theOrder = await OrderCollection.findByIdAndUpdate(mongoOrderId,{
                $set: {
                    ...orderObj,
                    orderStatus: orderStatus
                }
            },{new: true}).populate({
                path: "products", 
                populate: {
                    path: "product" 
                }
                ,strictPopulate: false
            }).populate({
                path: "orderBy",
                strictPopulate: false
            }); */
            /* here You can update single field in the collection*/
            orderObj.orderStatus = orderStatus;
            await orderObj.save();
            const theActualOrder = await OrderCollection.findById(mongoOrderId).populate({
                path: "products", 
                populate: {
                    path: "product" 
                }
                ,strictPopulate: false
            }).populate({
                path: "orderBy",
                strictPopulate: false
            });
            return response.status(200).json({msg: "Status is Updated",order: theActualOrder})
        }
    }
    catch(error){
        return ErrorUtil.catchErrors(error,response)
    }
}