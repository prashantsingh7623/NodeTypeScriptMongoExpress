import * as mongoose from "mongoose";
import {model} from "mongoose";
import PostModel from '../model/post.model';

const commentSchema = new mongoose.Schema({
    comment_content: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    updated_at: {
        type: Date,
        required: true
    }
});

commentSchema.post('remove', (async doc => {
    const comment = doc as any;
    const post = await PostModel.findOne({comments: {$in: [comment._id]}});
    await PostModel.findOneAndUpdate({
        _id: post._id
    }, {
        $pull: { comments: comment._id }
    });

}));

export default model('comments', commentSchema)