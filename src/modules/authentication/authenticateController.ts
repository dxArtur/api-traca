import {Request, Response} from 'express'
import { AuthUseCase } from './authenticateUseCase'

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

    async handle(req: Request, res: Response){
        try {
            const {email, password} = req.body
            const response = await this.authUseCase.execute({email, password})

            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }
}