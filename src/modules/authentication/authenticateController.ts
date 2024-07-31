import {Request, Response, NextFunction} from 'express'
import { AuthUseCase } from './authenticateUseCase'
import { SigninInputrDto } from '../../dto/UserDto'

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
            const {email, password}:SigninInputrDto = req.body
            const inputForAuth = {email, password}
            const response = await this.authUseCase.execute(inputForAuth)

            return res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }
}