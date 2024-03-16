import { Request, Response, NextFunction } from "express"
import { UpdateUserUseCase } from "./updateUserUseCase"
import { STATUS_CODE_SUCESS } from "custom/constants/StatusCode"

export class UpdateUserControler{
    private static instance: UpdateUserControler
    private updateUserUseCase: UpdateUserUseCase

    constructor(updateUserUseCase: UpdateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }

    static getInstance() {
        if (!UpdateUserControler.instance) {
            UpdateUserControler.instance = new UpdateUserControler(UpdateUserUseCase.getInstance())
        }
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, name, nick, password} = req.body
            const dataUpdated = {email, name, nick, password}
            const userId = req.params.userId
            const response = await this.updateUserUseCase.execute(userId, dataUpdated)
            return res.status(STATUS_CODE_SUCESS.OK).json(response)
        }catch (error) {
            
        }
    }
}