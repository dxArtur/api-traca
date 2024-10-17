import { Request, Response, NextFunction } from "express"
import { UseCase } from "./getAllCommentsInPublicationUseCase"
import STATUS_CODE from "../../../custom/constants/StatusCode"
import StatusCode from "../../../custom/constants/StatusCode"
import { PostDto, ReplyDto } from "../../../dto/PostDto"


export class GetAllCommentsInPublicationController {
    private static instance: GetAllCommentsInPublicationController
    private useCase: UseCase

    constructor(useCase: UseCase) {
        this.useCase= useCase
    }

    public static getInstance() {
        if ( !GetAllCommentsInPublicationController.instance ) {
            GetAllCommentsInPublicationController.instance = new GetAllCommentsInPublicationController(UseCase.getInstance())
        }

        return GetAllCommentsInPublicationController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            
            const publicationId = req.params.publicationId
            const response = await this.useCase.execute(publicationId)

            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

}