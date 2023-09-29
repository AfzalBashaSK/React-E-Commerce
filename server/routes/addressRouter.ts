import {Response, Router, Request} from "express";
import * as addressController from "../controllers/addressController";
import { body } from "express-validator";
import { validateForm } from "../middlewares/ValidateForm";
import { authMiddleware } from "../middlewares/authMiddleware";

const addressRouter: Router = Router();

/**
 * @usage : Create New Address
 * @method : POST
 * @url : http://localhost:9000/api/addresses/new
 * @access : PRIVATE
 * @params : name, email, mobile, address, Landmark, street, city, state, country, pincode
 */ 

addressRouter.post('/new', [
    body('mobile').not().isEmpty().withMessage("mobile is required"),
    body('flat').not().isEmpty().withMessage("address is required"),
    body('landmark').not().isEmpty().withMessage("landmark is required"),
    body('street').not().isEmpty().withMessage("street is required"),
    body('city').not().isEmpty().withMessage("city is required"),
    body('state').not().isEmpty().withMessage("state is required"),
    body('country').not().isEmpty().withMessage("country is required"),
    body('pinCode').not().isEmpty().withMessage("pinCode is required"),
],authMiddleware, validateForm, async (request: Request, response: Response) => {
    await addressController.createNewAddress(request, response);
});

/**
 * @usage : Update Address
 * @method : PUT
 * @url : http://localhost:9000/api/addresses/:addressId
 * @access : PRIVATE
 * @params : name, email, mobile, address, landmark, street, city, state, country, pincode
 */ 

addressRouter.put('/:addressId', [
    body('mobile').not().isEmpty().withMessage("mobile is required"),
    body('flat').not().isEmpty().withMessage("flat is required"),
    body('landmark').not().isEmpty().withMessage("landmark is required"),
    body('street').not().isEmpty().withMessage("street is required"),
    body('city').not().isEmpty().withMessage("city is required"),
    body('state').not().isEmpty().withMessage("state is required"),
    body('country').not().isEmpty().withMessage("country is required"),
    body('pinCode').not().isEmpty().withMessage("pinCode is required"),
],authMiddleware, validateForm, async (request: Request, response: Response) => {
    await addressController.updateAddress(request, response);
});


/**
 * @usage : Get Address
 * @method : GET
 * @url : http://localhost:9000/api/addresses/me
 * @access : PRIVATE
 * @params : no-params
 */

addressRouter.get('/me',authMiddleware, async (request: Request, response: Response) => {
    await addressController.getAddress(request, response);
});

/**
 * @usage : Delete Address
 * @method : DELETE
 * @url : http://localhost:9000/api/addresses/:addressId
 * @access : PRIVATE
 * @params : no-params
 */

addressRouter.delete('/:addressId',authMiddleware, async (request: Request, response: Response) => {
    await addressController.deleteAddress(request, response);
});

export default addressRouter;