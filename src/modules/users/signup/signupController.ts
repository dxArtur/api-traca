import { Request, Response, NextFunction } from "express"
import { SignupUseCase } from './signupUseCase'
import { CreateUserDto, UserDto } from "../../../dto/UserDto"


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
    

    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const {email, name, nick, password}:CreateUserDto = req.body
            const dataUser:CreateUserDto = {email, name, nick, password}
    
            const result = await this.signupUseCase.execute(dataUser)
            return res.status(201).json(result)    
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
} 