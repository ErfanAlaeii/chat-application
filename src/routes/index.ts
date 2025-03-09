import { Router } from "express";
import userRouter from './user.routes'
import AuthRouter from './auth.routes'
import conversationRouter from './conversation.Routes'
import messageRouter from "./message.Routes";
import postRouter from './post.Routes'

const createRouter = ()=>{
    const router = Router();
    router.use('/users',userRouter)
    router.use('./auth',AuthRouter)
    router.use('./conversation',conversationRouter)
    router.use('/message', messageRouter)
    router.use('./post',postRouter)

    return router;
}

export default createRouter;