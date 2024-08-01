import {Request, Response, NextFunction} from 'express'
import { AuthUseCase } from './authenticateUseCase'
import { SigninUserDto } from '../../dto/UserDto'
import StatusCode from '../../custom/constants/StatusCode'

export class AuthController{
    private static instance: AuthController
    private authUseCase: AuthUseCase

    constructor(authUseCase: AuthUseCase){
        this.authUseCase = authUseCase
    }

    public static getInstance(){
        if (!AuthController.instance) {
            AuthController.instance = new AuthController(AuthUseCase.getInstance())
        }

        return AuthController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const {email, password}:SigninUserDto = req.body
            const inputForAuth = {email, password}
            const response = await this.authUseCase.execute(inputForAuth)

            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }
}