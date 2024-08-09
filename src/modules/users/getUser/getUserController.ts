import { NextFunction, Request, Response } from "express"
import { UseCase } from "./getUserUseCase"
import StatusCode from "../../../custom/constants/StatusCode"



export class GetUserController {
    private static instance: GetUserController
    private useCase: UseCase


    constructor(useCase: UseCase) {
        this.useCase = useCase
    }

    public static getInstance() {
        if (! GetUserController.instance) {
            GetUserController.instance = new GetUserController(UseCase.getInstance())
        }

        return GetUserController.instance
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
