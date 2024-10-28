import { Request, Response, NextFunction } from "express"
import { UseCase } from "./likeCommentUseCase"
import StatusCode from "../../../custom/constants/StatusCode"


export class LikeCommentController {
    private static instance: LikeCommentController
    private useCase: UseCase

    constructor(useCase: UseCase) {
        this.useCase= useCase
    }

    public static getInstance() {
        if ( !LikeCommentController.instance ) {
            LikeCommentController.instance = new LikeCommentController(UseCase.getInstance())
        }

        return LikeCommentController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            
            const  parentId = req.params.parentId
            const  {authorId} = req.body
            const response = await this.useCase.execute(parentId, authorId)

            return res.status(response.status).send()
        } catch (error) {
            next(error)
        }
    }

}