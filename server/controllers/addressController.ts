import {Request, Response} from "express";
import * as ErrorUtil from "../util/ErrorUtil"
import { userUtil } from "../util/userUtil";
import AddressCollection from "../db/schemas/AddressSchema";
import mongoose from "mongoose";
import { IAddress } from "../db/models/IAddress";
import UsersTable from "../db/schemas/userSchema";

/**
 * Create New Address
 * @param request 
 * @param response 
 */
export const createNewAddress = async(request: Request, response: Response)=>{
    try{
        const userObj =await userUtil(request,response);
        if(userObj){
            let {mobile, flat, landmark, street, city, state, country, pinCode} = request.body;
            /* Check if address exists */
            const mongoUserId = new mongoose.Types.ObjectId(userObj._id);
            const userTableObj = await UsersTable.findById(mongoUserId);
            const addressObj = await AddressCollection.findOne({userObj: mongoUserId})
            if(addressObj){
                await AddressCollection.findOneAndRemove({userObj: mongoUserId});
            }
            // create Address
            if(userTableObj && userTableObj.username && userTableObj.email){
                let newAddress : IAddress = {
                    name: userTableObj?.username,
                    email: userTableObj?.email,
                    mobile :mobile, 
                    flat :flat, 
                    landmark :landmark, 
                    street :street, 
                    city :city, 
                    state :state, 
                    country :country, 
                    pinCode :pinCode,
                    userObj :userObj._id
                }
                const theAddress = await new AddressCollection(newAddress).save();
                if(!theAddress){
                    return response.status(401).json({
                        msg: "Address Creation is failed"
                    })
                }
                return response.status(200).json({
                    msg:"Address Is Created",
                    address: theAddress
                })
            }
        }
    }
    catch(error){
        return ErrorUtil.catchErrors(error,response)
    }
}

/**
 * Update Address
 * @param request 
 * @param response 
 */
export const updateAddress = async(request: Request, response: Response)=>{
    try{
        const {addressId} = request.params
        const userObj =await userUtil(request,response);
        if(userObj){
            const mongoAddressId = new mongoose.Types.ObjectId(addressId);
            let {mobile, flat, landmark, street, city, state, country, pinCode} = request.body;
            /* Check if address exists */
            const mongoUserId = new mongoose.Types.ObjectId(userObj._id);
            const userTableObj = await UsersTable.findById(mongoUserId);
            const addressObj = await AddressCollection.findById(mongoAddressId);
            if(!addressObj){
                return response.status(400).json({
                    msg: "No Address Found"
                });
            }
            // create Address
            if(userTableObj && userTableObj.username && userTableObj.email){
                let newAddress : IAddress = {
                    name: userTableObj?.username,
                    email: userTableObj?.email,
                    mobile :mobile, 
                    flat :flat, 
                    landmark :landmark, 
                    street :street, 
                    city :city, 
                    state :state, 
                    country :country, 
                    pinCode :pinCode,
                    userObj :userObj._id
                }
                const theAddress = await AddressCollection.findByIdAndUpdate(mongoAddressId,
                    {
                        $set : newAddress
                    },{new: true})
                if(!theAddress){
                    return response.status(401).json({
                        msg: "Address Updation is failed"
                    })
                }
                return response.status(200).json({
                    msg:"Address Is Updated",
                    address: theAddress
                })
            }
        }
    }
    catch(error){
        return ErrorUtil.catchErrors(error,response)
    }
}

/**
 * get Address
 * @param request 
 * @param response 
 */
export const getAddress = async(request: Request, response: Response)=>{
    try{
        const userObj =await userUtil(request,response);
        if(userObj){
            /* Check if address exists */
            const mongoUserId = new mongoose.Types.ObjectId(userObj._id);
            const userTableObj = await UsersTable.findById(mongoUserId);
            const addressObj = await AddressCollection.findOne({userObj: mongoUserId});
            if(!addressObj){
                return response.status(400).json({
                    msg: "No Address Found"
                });
            }
            return response.status(200).json(addressObj);
        }
    }
    catch(error){
        return ErrorUtil.catchErrors(error,response)
    }
}

/**
 * Delete Address
 * @param request 
 * @param response 
 */
export const deleteAddress = async(request: Request, response: Response)=>{
    try{
        const {addressId} = request.params;
        const mongoAddressId = new mongoose.Types.ObjectId(addressId);
        const addressObj = await AddressCollection.findById(mongoAddressId);
        if(!addressObj){
            return response.status(400).json({
                msg: "No Address Found"
            });
        }
        const theAddress = await AddressCollection.findByIdAndDelete(mongoAddressId);
        if(!theAddress){
            return response.status(400).json({msg:"Unable to delete the address"})
        }
        return response.status(200).json({msg: "Address is deleted"})
    }
    catch(error){
        return ErrorUtil.catchErrors(error,response)
    }
}