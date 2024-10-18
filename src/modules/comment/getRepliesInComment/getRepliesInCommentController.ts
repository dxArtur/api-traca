import { Request, Response, NextFunction } from "express"
import { UseCase } from "./getRepliesInCommentUseCase"
import STATUS_CODE from "../../../custom/constants/StatusCode"
import StatusCode from "../../../custom/constants/StatusCode"
import { PostDto, ReplyDto } from "../../../dto/PostDto"


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
            
            const parentId = req.params.parentId
            const response = await this.useCase.execute(parentId)

            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

}