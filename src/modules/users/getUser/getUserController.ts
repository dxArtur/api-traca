import { NextFunction, Request, Response } from "express"
import { UseCase } from "./getUserUseCase"
import StatusCode from "../../../custom/constants/StatusCode"



export class Controller {
    private static instance: Controller
    private useCase: UseCase


    constructor(useCase: UseCase) {
        this.useCase = useCase
    }

    public static getInstance() {
        if (! Controller.instance) {
            Controller.instance = new Controller(UseCase.getInstance())
        }

        return Controller.instance
    }

    async handle(req:Request, res:Response, next:NextFunction) {
        try {
            const username = req.params.username
            const response = await this.useCase.execute(username)
            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }
}
