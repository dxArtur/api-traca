import { CommentPublicationController } from "../modules/comment/commentInPublication/commentPublicationController"
import { ReplyCommentController } from "../modules/comment/replyComment/replyCommentController"
import { GetRepliesInCommentController } from "../modules/comment/getRepliesInComment/getRepliesInCommentController"
import { GetAllCommentsInPublicationController } from "../modules/comment/getAllCommentsInPublication/getAllCommentsInPublicationController"
import { Router, Request, Response, NextFunction } from "express"

const route = Router()
const commentPublicationController = CommentPublicationController.getInstance()
const replyCommentController = ReplyCommentController.getInstance()
const getAllCommentsInPublicationController = GetAllCommentsInPublicationController.getInstance()
const getRepliesInCommentController = GetRepliesInCommentController.getInstance()

route.post('/comment/:parentId', (req, res, next)=>commentPublicationController.handle(req, res, next))
route.get('/comments/:publicationId', (req, res, next)=>getAllCommentsInPublicationController.handle(req, res, next))

//responnder comentário
route.post('/reply/:publicationId/:parentId', (req, res, next)=>replyCommentController.handle(req, res, next))
route.get('/reply/:parentId', (req, res, next)=>getRepliesInCommentController.handle(req, res, next))
//route.get('/post', (req, res, next)=>getAllPostController.handle(req, res, next))

export default route