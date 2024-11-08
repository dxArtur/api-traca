import { Request, Response, NextFunction } from "express"
import { UseCase } from "./createReviewUseCase"
import StatusCode from "../../../custom/constants/StatusCode"


export class CreateReviewController {
    private static instance: CreateReviewController
    private useCase: UseCase

    constructor(useCase: UseCase) {
        this.useCase= useCase
    }

    public static getInstance() {
        if ( !CreateReviewController.instance ) {
            CreateReviewController.instance = new CreateReviewController(UseCase.getInstance())
        }

        return CreateReviewController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            
            const {title, review, authorReviewId, author } = req.body
            const response = await this.useCase.execute(author, title, review, authorReviewId)
            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

}