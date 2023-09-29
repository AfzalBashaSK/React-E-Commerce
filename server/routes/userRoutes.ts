import {Response, Router, Request} from "express";
import * as userController from "../controllers/userController";
import {body} from 'express-validator';
import {authMiddleware} from "../middlewares/authMiddleware";
import { validateForm } from "../middlewares/ValidateForm";

const userRoutes: Router = Router();

/**
 * @usage : Register a User
 * @method : POST
 * @url : http://localhost:9000/api/users/register
 * @access : PUBLIC
 * @param : username, email, password
 * @param request
 * @param response
 */ 

/* userview comes here in the form of object and displays like {username:enterd value,email: entered value,
    password: entered value} */
userRoutes.post('/register', [
    body('username').isLength({min: 5}).withMessage("Username is required"),
    body('email').isEmail().withMessage("Proper Email is required"),
    body('password').isStrongPassword().withMessage("Strong Password is required")
], validateForm, async (request: Request, response: Response) => {
    await userController.registerUser(request, response);
});

/* 
userRoutes.post('/register', [
    body('username').isLength({min: 5}).withMessage("Username is required"),
    body('email').isEmail().withMessage("Proper Email is required"),
    body('password').isStrongPassword().withMessage("Strong Password is required")
],ValidateForm, async (request: Request, response: Response) => {
    await userController.registerUser(request, response);
});

*/

/**
 * @usage : Login a User
 * @method : POSt
 * @url : http://localhost:9000/api/users/login
 * @access : PUBLIC
 * @param : email, password
 * @param request
 * @param response
 */
userRoutes.post('/login', [
    body('email').isEmail().withMessage("Proper Email is required"),
    body('password').isStrongPassword().withMessage("Strong Password is required")
],validateForm, async (request: Request, response: Response) => {
    await userController.loginUser(request, response);
});

/**
 * @usage : get User Info
 * @method : GET
 * @url : http://localhost:9000/api/users/me
 * @access : PRIVATE
 * @param : no-params
 * @param request
 * @param response
 */
userRoutes.get('/me', authMiddleware, async (request: Request, response: Response) => {
    await userController.getUserInfo(request, response);
});

/**
 * @usage : Update Profile Picture
 * @method : POST
 * @url : http://localhost:9000/api/users/profile
 * @access : PRIVATE
 * @param : imageUrl
 * @param request
 * @param response
 */

userRoutes.post('/profile',[
    body("imageUrl").not().isEmpty().withMessage("Profile imageUrl is requred")
],validateForm, authMiddleware, async (request: Request, response: Response) => {
    await userController.updateProfilePicture(request, response);
});


/**
 * @usage : Change the password
 * @method : POST
 * @url : http://localhost:9000/api/users/change-password
 * @access : PRIVATE
 * @param : passowrd
 * @param request
 * @param response
 */

userRoutes.post('/change-password',[
    body("password").isStrongPassword().withMessage("password is requred")
],validateForm, authMiddleware, async (request: Request, response: Response) => {
    await userController.changePassword(request, response);
});

export default userRoutes;

