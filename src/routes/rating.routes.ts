import { Router, Request, Response, NextFunction } from 'express'
import { CreateReviewController } from '../modules/review/create/createReviewController'
import { GetReviewByUserController } from '../modules/review/getByUser/getReviewByUserController'

const route = Router()

route.post('/rating', (req:Request, res: Response, next:NextFunction)=>
    CreateReviewController.getInstance().handle(req, res, next))

route.get('/rating/:authorId', (req:Request, res: Response, next:NextFunction)=>
    GetReviewByUserController.getInstance().handle(req, res, next))

export default route