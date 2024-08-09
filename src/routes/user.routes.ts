import { Router, Request, Response, NextFunction } from 'express'
import { SignupController } from '../modules/users/signup/signupController'
import { GetUserController } from '../modules/users/getUser/getUserController'
import { errorHandle } from '../middlewares/errorHandle'

const route = Router()
const signupController = SignupController.getInstance()

route.post('/signup', (req: Request, res: Response, next: NextFunction) => signupController.handle(req, res, next))
route.get('/user/:username', (req:Request, res: Response, next:NextFunction)=>
    GetUserController.getInstance().handle(req, res, next))

export default route