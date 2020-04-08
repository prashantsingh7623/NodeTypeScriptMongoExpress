import * as mongoose from 'mongoose';
import {model} from "mongoose";
import CommentModel from '../model/comment.model';

const postSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    updated_at: {
        type: Date,
        required: true
    },
    post_content: {
        type: String,
        required: true
    },
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: 'comments'
    }]
});

postSchema.virtual('comment_count').get(function () {
    return this.comments.length;
});

postSchema.post('remove', async (doc) => {
    const post = doc as any;
    for (let id of post.comments) {
        await CommentModel.findOneAndDelete({
            _id: id
        });
    }

});

export default model('posts', postSchema);