public static registerUser(user: UserView):
     Promise<{ data: { msg: string } }> {
        const dataUrl: string = `${this.serverUrl}/api/users/register`;
        return axios.post(dataUrl, user);
}

public static UpdateProfilePicture(imageUrl:string): Promise<{ data: { user: UserView } }> {
    const dataUrl: string = `${this.serverUrl}/api/users/profile`;
    return axios.post(dataUrl,{imageUrl}); // 
    /* we should not pass string thats y imagerl is passed like object {imageUrl}
        If u see user is an object. That's y in above loginUser itis provided directly as user but not like
        {user}
    */
}



------------------------------------------server/ Backend----------------------------------------------

userRoutes.post('/change-password',[
    body("password").isStrongPassword().withMessage("password is requred")
],validateForm, authMiddleware, async (request: Request, response: Response) => {
    await userController.changePassword(request, response);
});

export const  validateForm = async (request:Request,response: Response,next:NextFunction)=>{
    const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                msg: errors.array().map(error => error.msg).join("\n"),
                data: null,
                status: APP_CONSTANTS.FAILED
        })                
    }
    next();
}

import {Request, Response, NextFunction} from 'express';
import jwt from "jsonwebtoken";

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const token: any = request.headers['x-auth-token'];
        if (!token) {
            return response.status(401).json({msg: "No Token Provided"})
        }
        const secretKey: string | undefined = process.env.EXPRESS_JWT_SECRET_KEY;
        if (secretKey) {
            const decode: any = jwt.verify(token, secretKey, {algorithms: ["HS256"]});
            if (decode) {
                request.headers['user-info'] = decode.user;
                next(); // forward to the router
            } else {
                return response.status(401).json({msg: "Invalid Token Provided"})
            }
        }
    } catch (error) {
        return response.status(500).json({msg: "Token validation failed"})
    }
};

export const changePassword = async (request: Request, response: Response) => {
    try {

        let {password} = request.body // read image url from form
        const decodedToken: any = request.headers['user-info'];
        if (decodedToken) {
            const userId = decodedToken.id;
            const mongoUserId = new mongoose.Types.ObjectId(userId);
            const user: IUser | undefined | null | any = await UsersTable.findById(mongoUserId);
            if (user) {
                // encrypt the password 
                const salt = await bcryptjs.genSalt(11);
                const hashPassword = await bcryptjs.hash(password, salt);
                user.passowrd = hashPassword;
                let userResponse = await user.save(); 
                // Now this user is stored in database that is th power of save function
                if(userResponse){
                    return response.status(200).json({
                        user : user,
                        msg : "Password is updated, Please Login Again"
                    });
                }   
            }
        }
    } catch (error: any) {
        return ErrorUtil.catchErrors(error,response)
    }
};