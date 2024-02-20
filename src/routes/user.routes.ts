import { Router } from 'express'
import { SignupController } from '../modules/users/signup/signupController'
import { SignupUseCase } from '../modules/users/signup/signupUseCase'

const route = Router()
const signupController = SignupController.getInstance()

route.post('/signup', (req, res) => signupController.handle(req, res))

export default route