import * as mongoose from "mongoose";
import {model} from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    username: {
      required: true,
      type: String
    },
    verified: {
        required: true,
        type: Boolean,
        default: false
    },
    verification_token: {
        required: true,
        type: Number,
    },
    verification_token_time: {
        required: true,
        type: Date,
    },
    reset_password_token: {
        type: Number,
        required: false
    },
    reset_password_token_time: {
        type: Date,
        required: false
    },
    created_at: {
        required: true,
        type: Date,
        default: new Date()
    },
    updated_at: {
        required: true,
        type: Date,
        default: new Date()
    },
    profile_pic_url: {
        type: String,
        required: true
    }
});


export default model('users', userSchema);