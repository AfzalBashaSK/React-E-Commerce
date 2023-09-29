import {Request, Response} from "express";
import * as ErrorUtil from "../util/ErrorUtil"
import {CategoryCollection,SubCategoryCollection} from "../db/schemas/CategorySchema";
import { APP_CONSTANTS } from "../constants";
import { ICategory, ISubCategory } from "../db/models/ICategory";
import { userUtil } from "../util/userUtil";
import { IUser } from "../db/models/IUser";
import mongoose from "mongoose";

export interface UserPayload {
    id: string | undefined;
    email: string;
}

/**
 * @usage : Create a Category
 * @method : POST
 * @url : http://localhost:9000/
 * @access : PUBLIC
 * @param : username, email, password
 * @param request
 * @param response
 */
export const createCategory = async (request: Request, response: Response) => { 
    try {
        const userObj  = await userUtil(request,response);
        // read the form data
        if(userObj){
            if(userObj.isAdmin){
                let {name, description} = request.body;

                // check if the category is already exists
                const categoryObj = await CategoryCollection.findOne({name: name});
                if (categoryObj) {
                    return response.status(401).json({
                        msg: "Category is already exists",
                        data: null,
                        status: APP_CONSTANTS.FAILED
                    });
                }
                // insert the data
                const category: ICategory = {
                    name: name,
                    description: description,
                    subCategories: [] as ISubCategory[],
                };
                let theCategory= await new CategoryCollection(category).save();
                if (theCategory) {
                    return response.status(200).json({
                        msg: "Category is Created"
                    })
                }
            }
            else{
                return response.status(401).json({
                    msg: "You are not autherized To create"
                })
            }
        }
        
    } catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
    /* i can write response, error also but in catchErrors also then i have to change parameters order */   
};


/**
 * @usage : Create a Sub Category
 * @method : POST
 * @url : http://localhost:9000/
 * @access : PUBLIC
 * @param : username, email, password
 * @param request
 * @param response
 */
export const createSubCategory = async (request: Request, response: Response) => { 
    try {
        const {categoryId} = request.params;
        const mongoCategoryId = new mongoose.Types.ObjectId(categoryId);
        const userObj  = await userUtil(request,response);
        // read the form data
        if(userObj){
            if(userObj.isAdmin){
                let {name, description} = request.body;

                // check if the category is already exists
                const categoryObj = await CategoryCollection.findById(mongoCategoryId);
                if (!categoryObj) {
                    return response.status(401).json({
                        msg: "Category is not exists",
                        data: null,
                        status: APP_CONSTANTS.FAILED
                    });
                }

                // sub categories
                let theSub = await new SubCategoryCollection({name:name,description:description}).save();
                if(theSub){
                    categoryObj.subCategories.push(theSub);
                    let theCategory= await categoryObj.save();
                    if (theCategory) {
                        return response.status(200).json({
                            msg: "Sub Category is Created"
                        })
                    }
                }   
            }
            else{
                return response.status(401).json({
                    msg: "You are not autherized To create"
                })
            }
        }
        
    } catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
    /* i can write response, error also but in catchErrors also then i have to change parameters order */   
};


/**
 * @usage :get categories
 * @method : POST
 * @url : http://localhost:9000/
 * @access : PUBLIC
 * @param : username, email, password
 * @param request
 * @param response
 */
export const getAllCategories = async (request: Request, response: Response) => { 
    try {
        /* here Category Collection database consists all types of categories.
        so simply call it by find function */
        /* here "subCategories is ref in categorySchema and in subCategorySChema's model we wriiten
         ("subCategories", subCategorySchema);" s o now this ref matches with "subcategories" in subCategoruySchema
         and later we said that we want this data below ["_id","name","description"]*/
        const categories:ICategory[] = await CategoryCollection.find().populate("subCategories",["_id","name","description"]);
        return response.status(200).json(categories)
    } catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
    /* i can write response, error also but in catchErrors also then i have to change parameters order */   
};

