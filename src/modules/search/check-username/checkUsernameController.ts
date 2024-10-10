import { Request, Response, NextFunction } from "express"
import { CheckUsernameUseCase } from "./checkUsernameUseCase"
import STATUS_CODE from "../../../custom/constants/StatusCode"


export class CheckUsernameController{
    private static instance: CheckUsernameController
    private CheckUsernameUseCase: CheckUsernameUseCase

    constructor(CheckUsernameUseCase: CheckUsernameUseCase) {
        this.CheckUsernameUseCase= CheckUsernameUseCase
    }

    public static getInstance() {
        if ( !CheckUsernameController.instance ) {
            CheckUsernameController.instance = new CheckUsernameController(CheckUsernameUseCase.getInstance())
        }

        return CheckUsernameController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.params.query
            const response = await this.CheckUsernameUseCase.execute(query)
            return res.status(STATUS_CODE.STATUS_CODE_SUCESS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

}