import {  } from "@prisma/client"
import { SigninUseCase } from "./signinUseCase"
import { SigninUserDto } from "../../../dto/UserDto"
import { NextFunction, Request, Response } from "express"
import StatusCode from "../../../custom/constants/StatusCode"



export class SigninController {
    private static instance: SigninController
    private signinUseCase: SigninUseCase


    constructor(signinUseCase: SigninUseCase) {
        this.signinUseCase = signinUseCase
    }

    public static getInstance() {
        if (! SigninController.instance) {
            SigninController.instance = new SigninController(SigninUseCase.getInstance())
        }

        return SigninController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body
            const dataUser: SigninUserDto = {email, password}
            const {token, userData} = await this.signinUseCase.execute(dataUser)
            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json({token, userData})
        }catch (error) {
            console.log(error)
            next(error)
        }
    }
}