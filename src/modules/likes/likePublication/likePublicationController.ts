import { Request, Response, NextFunction } from "express"
import { UseCase } from "./likePublicationUseCase"
import STATUS_CODE from "../../../custom/constants/StatusCode"
import StatusCode from "../../../custom/constants/StatusCode"
import { PostDto } from "../../../dto/PostDto"


export class LikePublicationController {
    private static instance: LikePublicationController
    private useCase: UseCase

    constructor(useCase: UseCase) {
        this.useCase= useCase
    }

    public static getInstance() {
        if ( !LikePublicationController.instance ) {
            LikePublicationController.instance = new LikePublicationController(UseCase.getInstance())
        }

        return LikePublicationController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            
            const  publicationId = req.params.publicationId
            const  {authorId} = req.body
            const response = await this.useCase.execute(publicationId, authorId)

            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

}