import { Request, Response, NextFunction } from "express"
import { GetUserByIdUseCase } from "./getUserByIdUseCase"
import { STATUS_CODE_SUCESS } from "../../../custom/constants/StatusCode"


export class GetUserByIdController{
    private static instance: GetUserByIdController
    private getUserByIdUseCase: GetUserByIdUseCase

    constructor(getUserByIdUseCase: GetUserByIdUseCase) {
        this.getUserByIdUseCase= getUserByIdUseCase
    }

    public static getInstance() {
        if ( !GetUserByIdController.instance ) {
            GetUserByIdController.instance = new GetUserByIdController(GetUserByIdUseCase.getInstance())
        }

        return GetUserByIdController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {

        try {
            const userId = req.params.userId
            const response = await this.getUserByIdUseCase.execute(userId)
            return res.status(STATUS_CODE_SUCESS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

}