import { LikeCommentController } from "../modules/likes/likeComment/likeCommentController"
import { LikePublicationController } from "../modules/likes/likePublication/likePublicationController"
import { Router, Request, Response, NextFunction } from "express"

const route = Router()
const likePublicationController = LikePublicationController.getInstance()
const likeCommentController = LikeCommentController.getInstance()

route.post('/like/publication/:publicationId', (req, res, next)=>likePublicationController.handle(req, res, next))
route.post('/like/comment/:parentId', (req, res, next)=>likeCommentController.handle(req, res, next))

export default route