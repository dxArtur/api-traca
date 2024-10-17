import { Request, Response, NextFunction } from "express"
import { UseCase } from "./commentPublicationUseCase"
import STATUS_CODE from "../../../custom/constants/StatusCode"
import StatusCode from "../../../custom/constants/StatusCode"
import { PostDto } from "../../../dto/PostDto"


export class CommentPublicationController {
    private static instance: CommentPublicationController
    private useCase: UseCase

    constructor(useCase: UseCase) {
        this.useCase= useCase
    }

    public static getInstance() {
        if ( !CommentPublicationController.instance ) {
            CommentPublicationController.instance = new CommentPublicationController(UseCase.getInstance())
        }

        return CommentPublicationController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            
            const {content, publicationId, authorId}: PostDto = req.body
            const response = await this.useCase.execute({content, publicationId, authorId})

            return res.status(StatusCode.STATUS_CODE_SUCESS.CREATED).json(response)
        } catch (error) {
            next(error)
        }
    }

}