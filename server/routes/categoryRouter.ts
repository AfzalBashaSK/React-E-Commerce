import {Response, Router, Request} from "express";
import {body} from 'express-validator';
import { validateForm } from "../middlewares/ValidateForm";
import * as categoryController from "../controllers/categoryController"
import { authMiddleware } from "../middlewares/authMiddleware";

const categoryRouter: Router = Router();

/**
 * @usage : Create a Category
 * @method : POST
 * @url : http://localhost:9000/api/categories/
 * @access : PRIVATE
 * @param : name, description
 * @param request
 * @param response
 */ 

categoryRouter.post('/', [
    body('name').not().isEmpty().withMessage("Name is required"),
    body('description').not().isEmpty().withMessage("Description is required")
], validateForm,authMiddleware, async (request: Request, response: Response) => {
    await categoryController.createCategory(request, response);
});

/**
 * @usage : Create a Sub Category
 * @method : POST
 * @url : http://localhost:9000/api/categories/:categoryId
 * @access : PRIVATE
 * @param : name, description
 * @param request
 * @param response
 */ 

    categoryRouter.post('/:categoryId', [
        body('name').not().isEmpty().withMessage("Name is required"),
        body('description').not().isEmpty().withMessage("Description is required")
    ], validateForm,authMiddleware, async (request: Request, response: Response) => {
        await categoryController.createSubCategory(request, response);
    });

/**
 * @usage : Get all Categories
 * @method : GET
 * @url : http://localhost:9000/api/categories/
 * @access : PUBLIC
 * @param : no params
 * @param request
 * @param response
 */ 

categoryRouter.get('/', async (request: Request, response: Response) => {
    await categoryController.getAllCategories(request, response);
});


export default categoryRouter;