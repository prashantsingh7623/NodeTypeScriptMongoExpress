import { body, param} from 'express-validator';
import PostModel from '../model/post.model'
import {threadId} from "worker_threads";

export class PostsValidator {
    static addPost() {
        return [
            body('post_content', 'Empty posts are not valid...!').isString()
        ]
    }
    static getSinglePostById() {
        return [
            param('id', 'post id is required')
                .custom((id, {req}) => {
                    return PostModel.findOne({
                        _id:id
                    }).then(post => {
                        if (post) {
                            req.post = post;
                            return true;
                        } else {
                            throw new Error('post doesn\'t exists...!');
                        }
                    })
                })
        ]
    }
    static editPost() {
        return [
            body('post_content', 'Post content is required...!').isString()
        ]
    }
    static deletePost() {
        return [
            param('id', 'id is required to delete the post...!')
                .custom((id, {req}) => {
                    return PostModel.findOne({
                        _id: id
                    }).then(post => {
                        if (post) {
                            req.post = post;
                            return true;
                        } else {
                            throw new Error('Post with this id doesn\'t exists...!');
                        }
                    })
                })
        ]
    }
}