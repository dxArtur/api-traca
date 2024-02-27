import { AuthController } from "../modules/authentication/authenticateController"
import { Router, Request, Response, NextFunction } from "express"

const route = Router()
const authController = AuthController.getInstance()

route.post('/signin', (req, res, next)=>authController.handle(req, res, next))

export default route