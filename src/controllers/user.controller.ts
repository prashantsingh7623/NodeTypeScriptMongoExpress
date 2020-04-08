import {Utility} from "../utils/utility";
import UserModel from "../model/user.model";
import * as jwt from 'jsonwebtoken';
import {getEnvVariable} from "../environments/env";
import {NodeMailer} from "../utils/node.mailer";
import * as mongoose from "mongoose";


export class UserController {
    static async signUp(req, res, next) {
        const email = req.body.email;
        const pass = req.body.password;
        const user_name = req.body.username;
        const otp = Utility.generateVerificationToken();

        try {
            const hash = await Utility.encryptPassword(pass);
            const data = {
                email: email,
                password: hash,
                username: user_name,
                verification_token: otp,
                verification_token_time: Date.now() + new Utility().MAX_TOKEN_TIME
            };
            await new UserModel(data).save();

            //send mail
            await NodeMailer.sendEmail({
                to: ['prashantsingh7623@gmail.com'],
                subject: 'Testing Email Verification',
                text: 'Please verify your email by entering the provided OTP on your device.',
                html: `<h1>${ otp }</h1>`
            }).then(() => {
                res.send("Email send successfully...!");
            }).catch(err => {
                next(err);
            })

        } catch (e) {
            next(e)
        }
    }
    static async login(req, res, next) {
        const pass: string = req.query.password;
        const user = req.user;
        try {
            await Utility.comparePassword({plainPass:pass, encryptedPass:user.password});
            const data = {
                email: user.email,
                user_id: user._id //we are storing id in user_id.
            };
            const token = jwt.sign(data, getEnvVariable().jwt_secret_key, {
                expiresIn: '12d'
            });

            const message: any = {
                token: token,
                user: user
            };
            res.json(message);
        } catch (e) {
            next(e);
        }
    }
    static async OtpVerification(req, res, next) {
        const email = req.user.email; //this will come from authenticate middleware
        const otp = req.body.verification_token; //this will come from body
        try {
            const user = await UserModel.findOneAndUpdate({
                email: email,
                verification_token: otp,
                verification_token_time: {$gt: Date.now()}
            }, {
                verified: true
            }, {
                new: true
            });
            if (user) {
                res.send("OTP verification successful...!")
            } else {
                next(new Error('OTP expired. Please request again...!'))
            }
        } catch (e) {
            next(e);
        }
    }
    static async resendEmailWithOtp(req, res, next) {
        const email = req.user.email;
        const otp = Utility.generateVerificationToken();
        try {
            mongoose.set('useFindAndModify', false);
            const user = await UserModel.findOneAndUpdate({
                email: email
            }, {
                verification_token: otp,
                verification_token_time: Date.now() + new Utility().MAX_TOKEN_TIME
            });
            if (user) {
               await NodeMailer.sendEmail({
                   to: [email],
                   subject: 'Testing Email Verification',
                   text: 'Please verify your email by entering the provided OTP on your device.',
                   html: `<h1>${ otp }</h1>`
               }).then(() => {
                   res.send('email resend successfully...!')
               })
            } else {
                next(new Error('something went wrong..user may not exists...!'));
            }
        }catch (e) {
            next(e)
        }
    }
    static async updatePassword(req, res, next) {
        const user_id = req.user.user_id; //see UserController.login
        const pass = req.body.password;
        const new_pass = req.body.new_password;

        try {
            // never resolve any promise inside try-catch block. Because the error in promise will not be
            // catch by try-catch block. So either you should use .catch(err => {}) after .then(user => {})
            // or just avoid resolving promise inside try-catch block.

            mongoose.set('useFindAndModify',false);
            const user:any = await UserModel.findOne({
                _id: user_id
            });
            await Utility.comparePassword({plainPass:pass, encryptedPass:user.password});
            const newEncryptedPass = await Utility.encryptPassword(new_pass);
            const newUser = await UserModel.findOneAndUpdate({
                        _id: user_id
                    }, {password: newEncryptedPass}, {new: true});
            res.send(newUser);
        } catch (e) {
            next(e);
        }
    }
    static async sendResetPasswordMail(req, res, next) {
        const email = req.query.email;
        const resetPasswordOtp = Utility.generateVerificationToken();
        try {
            const updatedUser = await UserModel.findOneAndUpdate({
                email: email
            }, {updated_at: new Date(),
                reset_password_token: resetPasswordOtp,
                reset_password_token_time: Date.now() + new Utility().MAX_TOKEN_TIME
            }, {new: true});

            res.send(updatedUser);

            //sending mail
           await NodeMailer.sendEmail({
                to: [email],
                subject: 'Password reset OTP',
                text: 'Enter the following OTP to reset password',
                html: `<h1>${resetPasswordOtp}</h1>`
            })

        } catch (e) {
            next(e);
        }
    }
    static async resetPasswordOtpVerification(req, res, next) {
        res.send("reset password otp verified successfully...!")
    }
    static async resetPasswordFinal(req, res, next) {
        const user = req.user;
        const new_pass = req.body.new_password;
        const encrypt_pass = Utility.encryptPassword(new_pass);
        try {
            mongoose.set('useFindAndModify',false);
            await UserModel.findOneAndUpdate({
                _id: user._id
            }, {
                new_password: encrypt_pass,
                updated_at: Date.now()
            }, {new: true}).then(user => {
                if (user) {
                    res.send('Password reset successfully...!')
                } else {
                    throw new Error('Password didn\'t reset...!');
                }
            })
        } catch (e) {
            next(e);
        }
    }
    static async updateProfilePicture(req, res, next) {
        const user_id = req.user.user_id; // go to GlobalMiddleware.authenticate for more details.
        const file_url = 'http://localhost:5000/' + req.file.path;
       try {
           const user = await UserModel.findOneAndUpdate({
               _id: user_id
           }, {
               updated_at: Date.now(),
               profile_pic_url: file_url
           }, { new: true});

           if (user) {
               res.send(user)
           }
       }catch (e) {
           next(e);
       }
    }
}
