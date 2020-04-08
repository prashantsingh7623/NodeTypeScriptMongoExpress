import { validationResult } from "express-validator";
import * as jwt from 'jsonwebtoken'
import {getEnvVariable} from "../environments/env";


export class GlobalMiddleware {
    static checkError(req, res, next) {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            next(new Error(err.array()[0].msg));
        } else {
            next();
        }
    }
    static async authenticate(req, res, next) {
        const authHeader = req.headers.authorization;
        const token = authHeader? authHeader.slice(7, authHeader.length) : null;
        try {
            jwt.verify(token, getEnvVariable().jwt_secret_key, (err, decoded) => {
                if (err) {
                    next(err)
                } else if (!decoded) {
                    req.error_status = 401; //unauthorised
                    next(new Error('user not authorised...!'))
                } else {
                    // res.send(decoded);
                    req.user = decoded;  // here we set decoded to req.user variable
                    next();
                }
            });

        }catch (e) {
            req.error_status = 401; //unauthorised
            next(e);
        }
    }

}