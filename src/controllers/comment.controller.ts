import CommentModel from '../model/comment.model';
import * as mongoose from "mongoose";

export class CommentController {
    static async addComment(req, res, next) {
        const content = req.body.comment_content;
        const user_post = req.post;
        try {
            const data = {
                comment_content: content,
                created_at: new Date(),
                updated_at: new Date()
            };
            const comment = new CommentModel(data);
            console.log('comment is created...!');
            user_post.comments.push(comment); // here we are pushing comment but we have declared
            // array of id in PostModel, still it work because we have given reference of comments collection
            // and MongoDB is Smart.

            console.log('comment is pushed...!');
            await Promise.all([comment.save(), user_post.save()]);
            res.send(comment);
        } catch (e) {
            console.log('error in CommentController..!');
            next(e);
        }
    }
    static async editComment(req, res, next) {
        const content = req.body.comment_content;
        const commentId = req.params.id;
        try {
            mongoose.set('useFindAndModify', 'false');
            const comment = await CommentModel.findOneAndUpdate({
                _id: commentId
            }, {
                comment_content: content,
                updated_at: Date.now()
            }, {
                new: true
            });
            if (comment) { res.send(comment); }
            else { next(new Error('Comment not found in CommentModel...!')); }
        } catch (e) {
            next(e);
        }
    }
    static async deleteComment(req, res, next) {
        const comment= req.comment;
        try {
            // applying remove operation directly to comment document
            // instead of using findByIdAndRemove() method.
            await comment.remove();

            res.send(comment);
        } catch (e) {
            next(e);
        }
    }
}
