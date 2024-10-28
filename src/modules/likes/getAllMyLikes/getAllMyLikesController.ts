import { Request, Response, NextFunction } from "express"
import { UseCase } from "./getAllMyLikesUseCase"
import StatusCode from "../../../custom/constants/StatusCode"


export class GetAllMyLikesController {
    private static instance: GetAllMyLikesController
    private useCase: UseCase

    constructor(useCase: UseCase) {
        this.useCase= useCase
    }

    public static getInstance() {
        if ( !GetAllMyLikesController.instance ) {
            GetAllMyLikesController.instance = new GetAllMyLikesController(UseCase.getInstance())
        }

        return GetAllMyLikesController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const {userId} = req.params
            const response = await this.useCase.execute(userId)

            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

}