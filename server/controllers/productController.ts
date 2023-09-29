import { Request, Response } from "express"
import * as ErrorUtil from "../util/ErrorUtil"
import { userUtil } from "../util/userUtil"
import ProductCollection from "../db/schemas/productSchema"
import { IProduct } from "../db/models/IProduct"
import mongoose from "mongoose"

/**
 * Create Product
 * @param request
 * @param response
 */ 

export const createProduct = async (request: Request, response: Response) => {
    try{
        let {title, description, brand, imageUrl, price, quantity,categoryId,subCategoryId } = request.body
        // retrieve user details
        const userObj  = await userUtil(request,response);
        // read the form data
        if(userObj){
            // Check if admin exists
            if(userObj.isAdmin){
                // check product exist/not
                let product:IProduct | any = await ProductCollection.findOne({title:title});
                if(product){
                    return response.status(400).json({msg: "Product is already exists"})
                }
                /* Create Product */
                let newProduct:IProduct = {
                    title: title,
                    imageUrl: imageUrl,
                    description: description,
                    brand: brand,
                    quantity:quantity,
                    price: price,
                    categoryObj: categoryId,
                    subCategoryObj: subCategoryId,
                    userObj: userObj._id
                }
                const theProduct = await new ProductCollection(newProduct).save();
                if(!theProduct){
                    return response.status(400).json({
                        msg: "Product Creation is Failed"
                    })
                }

                const actualProduct = await ProductCollection.findById(new mongoose.Types.ObjectId(theProduct._id)).populate({
                    path: "userObj",
                    strictPopulate: false
                }).populate({
                    path: "categoryObj",
                    strictPopulate: false
                }).populate({
                    path : "subCategoryObj",
                    strictPopulate: false
                });

                return response.status(200).json({
                    msg: "Product Creation is Success",
                    product: actualProduct
                })
            }
        }
    }catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
 }

 /**
 * Create Product
 * @param request
 * @param response
 */ 

export const updateProduct = async (request: Request, response: Response) => {
    try{
        const {productId}=request.params;
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        let {title, description, brand, imageUrl, price, quantity,categoryId,subCategoryId } = request.body
        const userObj  = await userUtil(request,response);
        // read the form data
        if(userObj){
            // Check if admin exists
            if(userObj.isAdmin){
                // check product exist/not
                let product:IProduct | any = await ProductCollection.findById(mongoProductId);
                if(!product){
                    return response.status(400).json({msg: "Product is Not Found"})
                }
                /* Create Product */
                let newProduct:IProduct = {
                    title: title,
                    imageUrl: imageUrl,
                    description: description,
                    brand: brand,
                    quantity:quantity,
                    price: price,
                    categoryObj: categoryId,
                    subCategoryObj: subCategoryId,
                    userObj: userObj._id
                }

                let theProduct = await ProductCollection.findByIdAndUpdate(mongoProductId,{
                    $set : newProduct
                },{new: true}).populate({
                    path: "userObj", /* userObj we provided userId inside the newProduct because 
                    we already set the new product*/
                    strictPopulate: false
                }).populate({
                    path: "categoryObj", /* Simple technique path should be key/field/column of newProduct */
                    strictPopulate: false
                }).populate({
                    path : "subCategoryObj",
                    strictPopulate: false
                });
                if(!theProduct){
                    return response.status(400).json({
                        msg: "Product Updation is Failed"
                    })
                }
                return response.status(200).json({
                    msg: "Product Updation is Success",
                    product: theProduct
                })                
            }
        }        
    }catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
 }

 /* export const updateProductQuantity = async (request: Request, response: Response) => {
    try{
        const {productId,quant}=request.params;
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        const userObj  = await userUtil(request,response);
        // read the form data
        if(userObj){
            // Check if admin exists
            if(userObj.isAdmin){
                // check product exist/not
                let product:IProduct | any = await ProductCollection.findById(mongoProductId);
                if(!product){
                    return response.status(400).json({msg: "Product is Not Found"})
                }
                // Create Product
                let newProduct:IProduct = {
                    title: product.title,
                    imageUrl: product.imageUrl,
                    description: product.description,
                    brand: product.brand,
                    quantity:product.quantity-Number(quant),
                    price: product.price,
                    categoryObj: product.categoryId,
                    subCategoryObj: product.subCategoryId,
                    userObj: userObj._id
                }

                let theProduct = await ProductCollection.findByIdAndUpdate(mongoProductId,{
                    $set : newProduct
                },{new: true}).populate({
                    path: "userObj", 
                    strictPopulate: false
                }).populate({
                    path: "categoryObj", 
                    // Simple technique path should be key/field/column of newProduct
                    strictPopulate: false
                }).populate({
                    path : "subCategoryObj",
                    strictPopulate: false
                });
                if(!theProduct){
                    return response.status(400).json({
                        msg: "Product Updation is Failed"
                    })
                }
                return response.status(200).json({
                    msg: "Product Updation is Success",
                    product: theProduct
                })                
            }
        }        
    }catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
 } */

 /**
 * Get All Product
 * @param request
 * @param response
 */ 

export const getAllProducts = async (request: Request, response: Response) => {
    try{
        const products = await ProductCollection.find().populate({
            path: "userObj",
            strictPopulate: false
        }).populate({
            path: "categoryObj",
            strictPopulate: false
        }).populate({
            path : "subCategoryObj",
            strictPopulate: false
        });
        return response.status(200).json(products)
    }catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
 }

 /**
 * Get a Product
 * @param request
 * @param response
 */ 

export const getProduct = async (request: Request, response: Response) => {
    const {productId} = request.params;
    try{
        let mongoProductId = new mongoose.Types.ObjectId(productId)
        let product:IProduct | any = await ProductCollection.findById(mongoProductId).populate({
            path: "userObj",
            strictPopulate: false
        }).populate({
            path: "categoryObj",
            strictPopulate: false
        }).populate({
            path : "subCategoryObj",
            strictPopulate: false
        });
        if(!product){
            return response.status(400).json({msg: "Product is Not Found"})
        }
        return response.status(200).json(product)
    }catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
 }

  /**
 * Delete a Product
 * @param request
 * @param response
 */ 

export const deleteProduct = async (request: Request, response: Response) => {
    const {productId} = request.params;
    try{
        let mongoProductId = new mongoose.Types.ObjectId(productId)
        let product:IProduct | any = await ProductCollection.findById(mongoProductId).populate({
            path: "userObj",
            strictPopulate: false
        }).populate({
            path: "categoryObj",
            strictPopulate: false
        }).populate({
            path : "subCategoryObj",
            strictPopulate: false
        });
        if(!product){
            return response.status(400).json({msg: "Product is Not Found"})
        }
        const theProduct =await ProductCollection.findByIdAndDelete(mongoProductId);
        return response.status(200).json({
            msg: "Product Deletion is success"
        })
    }catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
 }


 /**
 * Get All Product
 * @param request
 * @param response
 */ 

export const getAllProductsWithCategoryId = async (request: Request, response: Response) => {
    const {categoryId}= request.params;
    try{
        const mongocategoryId = await new mongoose.Types.ObjectId(categoryId);
        const products = await ProductCollection.find({categoryObj:mongocategoryId}).populate({
            path: "userObj",
            strictPopulate: false
        }).populate({
            path: "categoryObj",
            strictPopulate: false
        }).populate({
            path : "subCategoryObj",
            strictPopulate: false
        });
        if(!products){
            return response.status(400).json({
                msg: "There are no products in the table"
            })
        }
        return response.status(200).json(products);
    }
    catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
 }