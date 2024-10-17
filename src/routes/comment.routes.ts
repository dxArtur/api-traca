import { CommentPublicationController } from "../modules/comment/commentInPublication/commentPublicationController"
import { ReplyCommentController } from "../modules/comment/replyComment/replyCommentController"
import { GetAllCommentsInPublicationController } from "../modules/comment/getAllCommentsInPublication/getAllCommentsInPublicationController"
import { Router, Request, Response, NextFunction } from "express"

const route = Router()
const commentPublicationController = CommentPublicationController.getInstance()
const replyCommentController = ReplyCommentController.getInstance()
const getAllCommentsInPublicationController = GetAllCommentsInPublicationController.getInstance()

route.post('/comment/:publicationId', (req, res, next)=>commentPublicationController.handle(req, res, next))
route.get('/comments/:publicationId', (req, res, next)=>getAllCommentsInPublicationController.handle(req, res, next))
route.post('/reply/:publicationId/:parentId', (req, res, next)=>replyCommentController.handle(req, res, next))
//route.get('/post', (req, res, next)=>getAllPostController.handle(req, res, next))

export default route