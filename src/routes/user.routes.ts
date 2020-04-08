import {Router} from "express";
import {UserController} from "../controllers/user.controller";
import {UserValidator} from "../validators/user.validator";
import {GlobalMiddleware} from "../middleware/middleware.error";
import {Utility} from "../utils/utility";

class UserRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    private getRoutes() {
        this.router.get('/login',
            UserValidator.login(), //calling the function
            GlobalMiddleware.checkError, //passing request to the function
            UserController.login);

        this.router.get('/resend/email',
            GlobalMiddleware.authenticate,
            UserController.resendEmailWithOtp);

        this.router.get('/reset/password',
            UserValidator.resetPasswordWithEmail(),
            GlobalMiddleware.checkError,
            UserController.sendResetPasswordMail);

        this.router.get('/verify/reset/password/otp',
            UserValidator.verifyResetPasswordOtpRequest(),
            GlobalMiddleware.checkError,
            UserController.resetPasswordOtpVerification)
    }


    private postRoutes() {
        this.router.post('/signup',
            UserValidator.signUp(),
            GlobalMiddleware.checkError,
            UserController.signUp);
    }

    private patchRoutes() {
        this.router.patch('/signup/otp',
            GlobalMiddleware.authenticate,
            UserValidator.verifyOtpRequest(),
            GlobalMiddleware.checkError,
            UserController.OtpVerification);

        this.router.patch('/update/password',
            GlobalMiddleware.authenticate,
            UserValidator.updatePassword(),
            GlobalMiddleware.checkError,
            UserController.updatePassword);

        this.router.patch('/reset/password',
            GlobalMiddleware.authenticate,
            UserValidator.resetPasswordRequest(),
            GlobalMiddleware.checkError,
            UserController.resetPasswordFinal);

        this.router.patch('/update/profilePicture',
            GlobalMiddleware.authenticate,
            new Utility().multer.single('profile_pic'),
            UserValidator.updateProfilePic(),
            GlobalMiddleware.checkError,
            UserController.updateProfilePicture)
    }

    private deleteRoutes() {

    }
}

export default new UserRoutes().router;