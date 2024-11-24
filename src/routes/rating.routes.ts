import { Router, Request, Response, NextFunction } from 'express'
import { CreateReviewController } from '../modules/review/create/createReviewController'
import { GetReviewsController } from '../modules/review/getByUser/getReviewByUserController'

const route = Router()

route.post('/rating', (req:Request, res: Response, next:NextFunction)=>
    CreateReviewController.getInstance().handle(req, res, next))

route.get('/rating', (req:Request, res: Response, next:NextFunction)=>
    GetReviewsController.getInstance().handle(req, res, next))

export default route