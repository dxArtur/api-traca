import { Request, Response, NextFunction } from "express"
import { UseCase } from "./createPostUseCase"
import STATUS_CODE from "../../../custom/constants/StatusCode"
import StatusCode from "../../../custom/constants/StatusCode"
import { PostDto } from "../../../dto/PostDto"


export class CreatePostController {
    private static instance: CreatePostController
    private useCase: UseCase

    constructor(useCase: UseCase) {
        this.useCase= useCase
    }

    public static getInstance() {
        if ( !CreatePostController.instance ) {
            CreatePostController.instance = new CreatePostController(UseCase.getInstance())
        }

        return CreatePostController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            
            const {content, authorId}: PostDto = req.body
            const response = await this.useCase.execute(content, authorId)

            return res.status(StatusCode.STATUS_CODE_SUCESS.CREATED).json(response)
        } catch (error) {
            next(error)
        }
    }

}