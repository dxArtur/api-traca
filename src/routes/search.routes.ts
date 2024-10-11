import { Router, Request, Response, NextFunction } from 'express'
import { QueryController } from '../modules/search/queryController'
import { CheckUsernameController } from '../modules/search/check-username/checkUsernameController'

const route = Router()

route.get('/search/:query', (req:Request, res: Response, next:NextFunction)=>
    QueryController.getInstance().handle(req, res, next))

route.get('/check-username/:nick', (req:Request, res: Response, next:NextFunction)=>
    CheckUsernameController.getInstance().handle(req, res, next))

export default route