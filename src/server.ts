import * as express from 'express'
import * as mongoose from 'mongoose'
import {getEnvVariable} from "./environments/env";
import UserRouter from './routes/user.routes';
import PostRouter from './routes/posts.router';
import CommentRouter from './routes/comment.router';
import * as bodyParser from "body-parser";


export class Server {
    public app: express.Application = express();
    constructor() {
        this.setConfiguration();
        this.setRoutes();
        this.error404Handler();
        this.handleErrors();
    }

    private setConfiguration() {
        this.connectMongoDB();
        this.setBodyParser();
        // Jobs.runRequiredJobs(); to run cronJobs
    }
    private setRoutes() {
        // to tell server to treat src/uploads folder as static folder
        this.app.use('/src/uploads', express.static('src/uploads'));
        this.app.use('/api/user', UserRouter);
        this.app.use('/api/post', PostRouter);
        this.app.use('/api/comment', CommentRouter)
    }
    private connectMongoDB() {
        let database_url = getEnvVariable().db_url;
        mongoose.connect(database_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => {
                console.log("mongoDB connected successfully...!");
            })
            .catch((err) => {
                console.log("mongoDB didn\'t connected successfully...!");
                console.log(err);
            });
    }
    private setBodyParser() {
        this.app.use(bodyParser.urlencoded({extended: true}));
    }
    private error404Handler() {
        this.app.use((req, res) => {
            res.status(404).send("error404 page not found...!");
        });
    }
    private handleErrors() {
        this.app.use((err, req, res, next) => {
            const message:any = {
                error: err.message,
                code: req.error_status || 500
            };
            res.status(500).json(message);
        })
    }
}