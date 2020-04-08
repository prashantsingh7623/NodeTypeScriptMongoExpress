import PostModel from '../model/post.model';
import * as mongoose from "mongoose";
import * as path from "path";

export class PostsController {
    static addPost(req, res, next) {
        const userId = req.user.user_id;
        const content = req.body.post_content;
        const data = {
            user_id: userId,
            post_content: content,
            created_at: new Date(),
            updated_at: new Date()
        };
        new PostModel(data).save().then(post => {
            res.send(post);
        }).catch(err => {
            next(err);
        })
    }
    static async getPostByUser(req, res, next) {
        const userId = req.user.user_id;
        const page = parseInt(req.query.page) || 1; // here page means Page no. not no. of pages
        const per_page = 2;
        let current_page = page;
        let previous_page = page === 1? null : page - 1; // if page number = 1, than there's no previous page.
        let next_page_token = page + 1; // to retrieve the next page. We send request to server with this value.
        try  {
            const postCount = await PostModel.countDocuments({
                user_id:userId
            });
            let tot_pages = Math.ceil(postCount / per_page); // to count total pages required.

            // if total pages = 2 and currently you are at page 2 that means there is nothing to show next.
            // and if there are no pages than also there is nothing to show next.
            if (tot_pages === current_page || tot_pages === 0) {
                next_page_token = 0;
            }

            if (page > tot_pages) {
                next(new Error('No more posts to show...!'));
            }

            const post = await PostModel.find({
                user_id:userId
            }, {
                user_id:0,
                __v:0
            }).populate({path: 'comments', select: 'comment_content'})
                .skip(per_page * current_page - per_page)
                .limit(per_page);
            const data:any = {
                posts: post,
                page_token: next_page_token,
                total_pages: tot_pages,
                current_page: current_page,
                previous_page: previous_page
            };
            res.json(data);
        }catch (e) {
            next(e)
        }
    }
    static async getAllPosts(req, res, next) {
        const page = parseInt(req.query.page);
        const per_page = 2;
        let current_page = page;
        let next_page_token = page + 1;
        let previous_page = page == 1 ? null : page - 1;
        try {
            const postCount = await PostModel.estimatedDocumentCount();
            let tot_pages = Math.ceil(postCount / per_page);
            if (tot_pages === current_page || tot_pages === 0) {
                next_page_token = 0;
            }
            if (page > tot_pages) {
                next(new Error('No more posts to show...!'));
            }
            const post = await PostModel.find({}, {user_id:0, __v:0})
                .populate({path: 'comments', select: 'comment_content'})
                .skip(per_page * current_page - per_page)
                .limit(per_page);
            const data:any = {
                posts: post,
                page_token: next_page_token,
                total_pages: tot_pages,
                current_page: current_page,
                previous_page: previous_page
            };
            res.json(data);
        }catch (e) {
            next(e);
        }
    }
    static async getSinglePostById(req, res, next) {
        const data: any = {
            post: req.psot,
            count: req.post.commnet_count
        };
        res.json(data);
    }
    static async editPost(req, res, next) {
        const content = req.body.post_content;
        const post_id = req.params.id;
        try {
            mongoose.set('useFindAndModify', false);
            const post =  await PostModel.findOneAndUpdate({
                _id: post_id
            }, {
                post_content: content,
                updated_at: Date.now()
            }, {
                new: true
            }).populate({path: 'comments', select: 'comment_content'});
            if (post) { res.send(post); }
            else { next(new Error('posts not found...!')); }
        } catch (e) {
            next(e);
        }
    }
    static async deletePost(req, res, next) {
        const post = req.post;
        try {
            // applying remove operation directly to comment document
            // instead of using findByIdAndRemove() method.
            await post.remove();
            res.send(post);
        } catch (e) {
            next(e);
        }
    }
}