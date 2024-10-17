import { LikePublicationController } from "../modules/likes/likePublication/likePublicationController"
import { Router, Request, Response, NextFunction } from "express"

const route = Router()
const likePublicationController = LikePublicationController.getInstance()

route.post('/like/:publicationId', (req, res, next)=>likePublicationController.handle(req, res, next))

export default route