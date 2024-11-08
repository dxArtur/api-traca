import { Request, Response, NextFunction } from "express"
import { UseCase } from "./getMyPublicationsUseCase"
import StatusCode from "../../../custom/constants/StatusCode"


export class GetMyPublicationsController {
    private static instance: GetMyPublicationsController
    private useCase: UseCase

    constructor(useCase: UseCase) {
        this.useCase= useCase
    }

    public static getInstance() {
        if ( !GetMyPublicationsController.instance ) {
            GetMyPublicationsController.instance = new GetMyPublicationsController(UseCase.getInstance())
        }

        return GetMyPublicationsController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.body.userId
            const response = await this.useCase.execute(userId)
            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

}