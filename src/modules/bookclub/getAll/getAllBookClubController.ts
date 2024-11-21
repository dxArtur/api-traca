// controllers/getAllBookClubs/GetAllBookClubsController.ts

import { NextFunction, Request, Response } from "express";
import { UseCase } from "../../../modules/bookclub/getAll/getAllBookUseCase";
import StatusCode from "../../../custom/constants/StatusCode";
import ErrorMessages from "../../../custom/constants/ErrorMessages";
import { AppError } from "../../../errors/AppErrors";

export class GetAllBookClubsController {
    private static instance: GetAllBookClubsController;
    private useCase: UseCase;

    constructor(useCase: UseCase) {
        this.useCase = useCase;
    }

    public static getInstance() {
        if (!GetAllBookClubsController.instance) {
            GetAllBookClubsController.instance = new GetAllBookClubsController(UseCase.getInstance());
        }

        return GetAllBookClubsController.instance;
    }
    

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const bookClubs = await this.useCase.execute();
            
            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(bookClubs);
        } catch (error) {
           next(error)
        }
    }
}
