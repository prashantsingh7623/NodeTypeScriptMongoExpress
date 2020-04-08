import {body, param} from 'express-validator';
import PostModel from '../model/post.model';
import CommentModel from '../model/comment.model';
import {encodeXText} from "nodemailer/lib/shared";

export class CommentValidator {
    static addComment() {
        return [
            body('comment_content', 'Comment cannot be empty...!').isString(),
            param('id', 'Please enter post id to comment...!')
                .custom((id, {req}) => {
                    return PostModel.findOne({
                        _id: id
                    }).then(post => {
                        if (post) {
                           req.post = post;
                           return true;
                        } else {
                            throw new Error('Post doesn\'t exists...!');
                        }
                    })
                })
        ]
    }
    static editComment() {
        return [
            body('comment_content', 'Comment cannot be empty...!').isString()
        ]
    }
    static deleteComment() {
        return [
            param('id', 'comment id is required to perform delete operation')
                .custom((id, {req}) => {
                    return CommentModel.findOne({
                        _id:id
                    }).then(comment => {
                        if (comment) {
                            req.comment = comment;
                            return true;
                        } else {
                            throw new Error('Comment id didn\'t belong to any comment...!');
                        }
                    })
                })
        ]
    }
}