// controllers/getAllBookClubs/GetAllBookClubsController.ts

import { NextFunction, Request, Response } from "express";
import { UseCase } from "../../../modules/bookclub/get/getBookClubUseCase";
import StatusCode from "../../../custom/constants/StatusCode";
import ErrorMessages from "../../../custom/constants/ErrorMessages";
import { AppError } from "../../../errors/AppErrors";

export class GetBookClubsController {
    private static instance: GetBookClubsController;
    private useCase: UseCase;

    constructor(useCase: UseCase) {
        this.useCase = useCase;
    }

    public static getInstance() {
        if (!GetBookClubsController.instance) {
            GetBookClubsController.instance = new GetBookClubsController(UseCase.getInstance());
        }

        return GetBookClubsController.instance;
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { bookclubId } = req.params
            const bookClubs = await this.useCase.execute(bookclubId);
            
            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(bookClubs);
        } catch (error) {
           next(error)
        }
    }
}
