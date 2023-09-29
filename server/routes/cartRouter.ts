import {Response, Router, Request} from "express";
import {body} from 'express-validator';
import { validateForm } from "../middlewares/ValidateForm";
import * as cartController from "../controllers/cartController"
import { authMiddleware } from "../middlewares/authMiddleware";

const cartRouter: Router = Router(); 

/**
 * @usage : create a Cart
 * @method : POST
 * @url : http://localhost:9000/api/carts/
 * @access : PRIVATE
 * @params : products[{product,count,price}],total,tax,grandTotal
 */ 
cartRouter.post('/', [
    body('products').not().isEmpty().withMessage("products are required"),
    body('total').not().isEmpty().withMessage("total is required"),
    body('tax').not().isEmpty().withMessage("tax is required"),
    body('grandTotal').not().isEmpty().withMessage("grandTotal is required"),
],authMiddleware, validateForm, async (request: Request, response: Response) => {
    await cartController.createCart(request, response);
});

/**
 * @usage : get a Cart
 * @method : GET
 * @url : http://localhost:9000/api/carts/me
 * @access : PRIVATE
 * @params : no-params
 */ 
cartRouter.get('/me',authMiddleware, async (request: Request, response: Response) => {
    await cartController.getCartInfo(request, response);
});

export default cartRouter;