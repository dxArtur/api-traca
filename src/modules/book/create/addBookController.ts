import { Request, Response, NextFunction } from "express"
import { UseCase } from "./addBookUseCase"
import StatusCode from "../../../custom/constants/StatusCode"


export class GetRepliesInCommentController {
    private static instance: GetRepliesInCommentController
    private useCase: UseCase

    constructor(useCase: UseCase) {
        this.useCase= useCase
    }

    public static getInstance() {
        if ( !GetRepliesInCommentController.instance ) {
            GetRepliesInCommentController.instance = new GetRepliesInCommentController(UseCase.getInstance())
        }

        return GetRepliesInCommentController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            
            const {title, authorName } = req.body
            const response = await this.useCase.execute(title, authorName)

            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

}