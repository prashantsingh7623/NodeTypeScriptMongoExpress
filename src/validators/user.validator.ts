import UserModel from "../model/user.model";
import { query, body } from "express-validator";

export class UserValidator {
    static login() {
        return [
            query('email', 'Email is required for login...!').isEmail()
                .custom((email, {req}) => {
                    return UserModel.findOne({email: email}).then(user => {
                        if (user) {
                            req.user = user; //we made a variable user inside req, can be accessed using req.user
                        } else {
                            throw new Error("User is not registered...!");
                        }
                    })
                }),

            query('password', 'Password is required...!')
        ]
    }
    static signUp() {
        return [
            body('email', 'Email is required for signUp...!').isEmail()
                .custom((email, {req}) => {
                    return UserModel.findOne({email : email}).then(user => {
                        if(user) {
                            throw new Error('User with this email already exists...!')
                        } else {
                            return true
                        }
                    })
                }),
            body('password', 'Password is required ...!')
                .isAlphanumeric().withMessage('password must contain number and alphabet...!')
                .isLength({min : 8, max : 20}).withMessage('length of password must be between 8 - 20'),
            body('username', 'username is required...!').isString()
        ]
    }
    static verifyOtpRequest() {
        return [
            body('verification_token', 'OTP is required...!').isNumeric()
        ]
    }
    static updatePassword() {
        return [
            body('password', 'password id required...!').isAlphanumeric(),
            body('new_password', 'please enter new password...!').isAlphanumeric(),
            body('confirm_password', 'confirm password is required...!').isAlphanumeric()
                .custom((confPassword, {req}) => {
                    if (confPassword == req.body.new_password) {
                        return true;
                    } else {
                        req.error_status = 422; //unprocessable entity
                        throw new Error('new password and confirm password didn\'t match...!')
                    }
                })
        ]
    }
    static resetPasswordWithEmail() {
        return [
            query('email', 'Email is required...!').isEmail()
                .custom((email, {req}) => {
                   return UserModel.findOne({
                        email: email
                    }).then(user => {
                        if (user) {
                            return true
                        } else {
                            throw new Error('Email doesn\'t exists...!');
                        }
                    })
                })
        ]
    }
    static verifyResetPasswordOtpRequest() {
        return [
            query('reset_password_token', 'reset password token is required...!').isNumeric()
                .custom((token, {req}) => {
                    return UserModel.findOne({
                        reset_password_token: token,
                        reset_password_token_time: {$gt: Date.now()}
                    }).then(user => {
                        if (user) {
                            return true
                        } else {
                            throw new Error('Token is expired...!')
                        }
                    })
                })
        ]
    }
    static resetPasswordRequest() {
        return [
            body('email','email is required to reset password...!').isEmail()
                .custom((email, {req}) => {
                    return UserModel.findOne({
                        email: email
                    }).then(user => {
                        if (user) {
                            req.user = user;
                            return true;
                        } else {
                            throw new Error('user doesn\'t exists...!');
                        }
                    })
                }),
            body('new_password', 'new_password is required...!').isAlphanumeric(),
            body('confirm_password', 'Confirm password field is compulsory...!').isAlphanumeric()
                .custom((cnf_pass, {req}) => {
                    if (cnf_pass == req.body.new_password) {
                        return true
                    } else {
                        throw new Error('Confirm Password & New Password didn\'t match...!')
                    }
                }),
            body('reset_password_token', 'reset_password_token is required...!').isNumeric()
                .custom((otp, {req}) => {
                    if (otp == req.user.reset_password_token) {
                        return true
                    } else {
                        req.error_status = 422;
                        throw new Error('otp expired...!')
                    }
                })
        ]
    }
    static updateProfilePic() {
        return [
            body('profile_pic', 'This field is compulsory...!')
                .custom((profilePic, {req}) => {
                    if (req.file) { return true; }
                    else { throw new Error('File not uploaded...!'); }
                })
        ]
    }
}
