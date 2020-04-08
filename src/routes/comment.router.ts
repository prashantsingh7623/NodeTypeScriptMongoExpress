import {Router} from "express";
import {GlobalMiddleware} from "../middleware/middleware.error";
import {CommentValidator} from "../validators/comment.validator";
import {CommentController} from "../controllers/comment.controller";

class CommentRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.getRouter();
        this.postRouter();
        this.patchRouter();
        this.deleteRouter();
    }
    getRouter() {}
    postRouter() {
        this.router.post('/add/:id',
            GlobalMiddleware.authenticate,
            CommentValidator.addComment(),
            GlobalMiddleware.checkError,
            CommentController.addComment)
    }
    patchRouter() {
        this.router.patch('/edit/:id',
            GlobalMiddleware.authenticate,
            CommentValidator.editComment(),
            GlobalMiddleware.checkError,
            CommentController.editComment)
    }
    deleteRouter() {
        this.router.delete('/delete/:id',
            GlobalMiddleware.authenticate,
            CommentValidator.deleteComment(),
            GlobalMiddleware.checkError,
            CommentController.deleteComment)
    }
}

export default new CommentRouter().router;