import { CommentPublicationController } from "../modules/comment/commentInPublication/commentPublicationController"
import { GetAllPostController } from "../modules/post/getAll/getAllPostsController"
import { Router, Request, Response, NextFunction } from "express"

const route = Router()
const commentPublicationController = CommentPublicationController.getInstance()
const getAllPostController = GetAllPostController.getInstance()

route.post('/comment', (req, res, next)=>commentPublicationController.handle(req, res, next))
//route.get('/post', (req, res, next)=>getAllPostController.handle(req, res, next))

export default route