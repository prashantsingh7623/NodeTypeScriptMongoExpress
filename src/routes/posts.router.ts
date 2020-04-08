import {Router} from "express";
import {GlobalMiddleware} from "../middleware/middleware.error";
import {PostsValidator} from "../validators/posts.validator";
import {PostsController} from "../controllers/posts.controller";
import Global = WebAssembly.Global;

class PostsRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    getRoutes() {
        this.router.get('/me',
            GlobalMiddleware.authenticate,
            PostsController.getPostByUser);

        this.router.get('/all',
            GlobalMiddleware.authenticate,
            PostsController.getAllPosts)

        this.router.get('/:id',
            GlobalMiddleware.authenticate,
            PostsValidator.getSinglePostById(),
            GlobalMiddleware.checkError,
            PostsController.getSinglePostById)
    }
    postRoutes() {
        this.router.post('/add',
            GlobalMiddleware.authenticate,
            PostsValidator.addPost(),
            GlobalMiddleware.checkError,
            PostsController.addPost)
    }
    patchRoutes() {
        this.router.patch('/edit/:id',
            GlobalMiddleware.authenticate,
            PostsValidator.editPost(),
            GlobalMiddleware.checkError,
            PostsController.editPost)
    }
    deleteRoutes() {
        this.router.delete('/delete/:id',
            GlobalMiddleware.authenticate,
            PostsValidator.deletePost(),
            GlobalMiddleware.checkError,
            PostsController.deletePost)
    }
}

export default new PostsRouter().router;