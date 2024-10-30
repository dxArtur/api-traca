import { Request, Response, NextFunction } from "express"
import { UseCase } from "./replyCommentUseCase"
import STATUS_CODE from "../../../custom/constants/StatusCode"
import StatusCode from "../../../custom/constants/StatusCode"
import { PostDto, ReplyDto } from "../../../dto/PostDto"


export class ReplyCommentController {
    private static instance: ReplyCommentController
    private useCase: UseCase

    constructor(useCase: UseCase) {
        this.useCase= useCase
    }

    public static getInstance() {
        if ( !ReplyCommentController.instance ) {
            ReplyCommentController.instance = new ReplyCommentController(UseCase.getInstance())
        }

        return ReplyCommentController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            //const publicationId = req.params.publicationId
            const parentId = req.params.parentId
            const {content, authorId}: ReplyDto = req.body
            const response = await this.useCase.execute({content, authorId, parentId})

            return res.status(StatusCode.STATUS_CODE_SUCESS.CREATED).json(response)
        } catch (error) {
            next(error)
        }
    }

}