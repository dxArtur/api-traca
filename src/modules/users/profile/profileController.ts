import { NextFunction, Request, Response } from "express"
import { UseCase } from "./profileUseCase"
import StatusCode from "../../../custom/constants/StatusCode"



export class ProfileController {
    private static instance: ProfileController
    private useCase: UseCase


    constructor(useCase: UseCase) {
        this.useCase = useCase
    }

    public static getInstance() {
        if (! ProfileController.instance) {
            ProfileController.instance = new ProfileController(UseCase.getInstance())
        }

        return ProfileController.instance
    }

    async handle(req:Request, res:Response, next:NextFunction) {
        try {
            const authorizationHeader = req.headers.authorization
            const response = await this.useCase.execute(authorizationHeader!)

            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }
}
