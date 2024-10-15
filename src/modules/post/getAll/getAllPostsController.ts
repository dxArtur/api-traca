import { Request, Response, NextFunction } from "express"
import { UseCase } from "./getAllPostsUseCase"
import STATUS_CODE from "../../../custom/constants/StatusCode"
import StatusCode from "../../../custom/constants/StatusCode"
import { PostDto } from "../../../dto/PostDto"


export class GetAllPostController {
    private static instance: GetAllPostController
    private useCase: UseCase

    constructor(useCase: UseCase) {
        this.useCase= useCase
    }

    public static getInstance() {
        if ( !GetAllPostController.instance ) {
            GetAllPostController.instance = new GetAllPostController(UseCase.getInstance())
        }

        return GetAllPostController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.useCase.execute()

            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

}