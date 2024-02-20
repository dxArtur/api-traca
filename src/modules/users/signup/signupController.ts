import { Request, Response } from "express"
import { SignupUseCase } from './signupUseCase'


export class SignupController{
    private static instance: SignupController
    private signupUseCase: SignupUseCase

    constructor( signupUseCase: SignupUseCase) {
        this.signupUseCase = signupUseCase
    }

    public static getInstance(){
        if( !SignupController.instance) {
            SignupController.instance = new SignupController(SignupUseCase.getInstance())
        }
        return SignupController.instance
    }
    

    async handle(req: Request, res: Response){
        try {
            const {email, name, password, saves, books}:any = req.body
            const dataUser = {email, name, password, saves, books}
    
            const result = await this.signupUseCase.execute(dataUser)
            return res.status(201).json(result)    
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }
} 