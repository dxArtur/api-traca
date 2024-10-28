import { CreatePostController } from "../modules/post/create/createPostController"
import { GetAllPostController } from "../modules/post/getAll/getAllPostsController"
import { Router, Request, Response, NextFunction } from "express"

const route = Router()
const createPublicationController = CreatePostController.getInstance()
const getAllPostController = GetAllPostController.getInstance()

route.post('/publication', (req, res, next)=>createPublicationController.handle(req, res, next))
route.get('/publication', (req, res, next)=>getAllPostController.handle(req, res, next))

export default route