import { Router, Request, Response, NextFunction } from 'express'
import { CreateReviewController } from '../modules/review/create/createReviewController'

const route = Router()

route.post('/rating', (req:Request, res: Response, next:NextFunction)=>
    CreateReviewController.getInstance().handle(req, res, next))

export default route