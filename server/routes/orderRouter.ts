import {Response, Router, Request} from "express";
import {body} from 'express-validator';
import { validateForm } from "../middlewares/ValidateForm";
import * as orderContoller from "../controllers/orderContoller"
import { authMiddleware } from "../middlewares/authMiddleware";

const orderRouter: Router = Router();

/**
 * @usage : place an Order
 * @method : POST
 * @url : http://localhost:9000/api/orders/place
 * @access : PRIVATE
 * @params : products[{product,price,count}],total,tax,grandTotal, paymentType, orderStatus
 */
orderRouter.post('/place', [
    body('products').not().isEmpty().withMessage("products are required"),
    body('total').not().isEmpty().withMessage("total is required"),
    body('tax').not().isEmpty().withMessage("tax is required"),
    body('grandTotal').not().isEmpty().withMessage("grandTotal is required"),
    body('paymentType').not().isEmpty().withMessage("paymentType is required")
],authMiddleware, validateForm, async (request: Request, response: Response) => {
    await orderContoller.placeOrder(request, response);
});

/**
 * @usage : get all orders
 * @method : GET
 * @url : http://localhost:9000/api/orders/all
 * @access : PRIVATE
 * @params : no-params
 */
orderRouter.get('/all',authMiddleware,async (request: Request, response: Response) => {
    await orderContoller.getAllOrders(request, response);
});

/**
 * @usage : get my orders
 * @method : GET
 * @url : http://localhost:9000/api/orders/me
 * @access : PRIVATE
 * @params : no-params
 */
orderRouter.get('/me',authMiddleware,async (request: Request, response: Response) => {
    await orderContoller.getMyOrders(request, response);
});

/**
 * @usage : update order status
 * @method : POST
 * @url : http://localhost:9000/api/orders/:orderId
 * @access : PRIVATE
 * @params : orderStatus
 */

orderRouter.post('/:orderId', [
    body('orderStatus').not().isEmpty().withMessage("orderStatus is required"),
],authMiddleware, validateForm, async (request: Request, response: Response) => {
    await orderContoller.updateOrderStatus(request, response);
});
 
export default orderRouter; 
