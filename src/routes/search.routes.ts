import { Router, Request, Response, NextFunction } from 'express'
import { QueryController } from '../modules/search/queryController'

const route = Router()

route.get('/search/:query', (req:Request, res: Response, next:NextFunction)=>
    QueryController.getInstance().handle(req, res, next))

export default route