import { Request, Response, NextFunction } from "express"
import { UpdateUserUseCase } from "./updateUserUseCase"
import STATUS_CODE from "../../../custom/constants/StatusCode"

export class UpdateUserController{
    private static instance: UpdateUserController
    private updateUserUseCase: UpdateUserUseCase

    constructor(updateUserUseCase: UpdateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }

    static getInstance() {
        if (!UpdateUserController.instance) {
            UpdateUserController.instance = new UpdateUserController(UpdateUserUseCase.getInstance())
        }
        return UpdateUserController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, name, nick, password, profilePicture} = req.body
            const dataUpdated = {email, name, nick, password, profilePicture}
            const userId = req.params.userId
            const response = await this.updateUserUseCase.execute(userId, dataUpdated)
            return res.status(STATUS_CODE.STATUS_CODE_SUCESS.OK).json(response)
        }catch (error) {
            throw error
        }
    }
}