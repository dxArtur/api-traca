import { AuthController } from "../modules/authentication/authenticateController"
import { Router } from "express"

const route = Router()
const authController = AuthController.getInstance()

route.post('/signin', (req, res)=>authController.handle(req, res))

export default route