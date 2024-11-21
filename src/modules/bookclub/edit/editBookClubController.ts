import { NextFunction, Request, Response } from "express";
import { UseCase } from "../../../modules/bookclub/edit/editBookClubUseCase";
import { AppError } from "../../../errors/AppErrors";
import StatusCode from "../../../custom/constants/StatusCode";

export class EditBookClubController {
    private static instance: EditBookClubController;
    private useCase: UseCase;

    constructor(useCase: UseCase) {
        this.useCase = useCase;
    }

    public static getInstance() {
        if (!EditBookClubController.instance) {
            EditBookClubController.instance = new EditBookClubController(UseCase.getInstance());
        }

        return EditBookClubController.instance;
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        const { bookclubId } = req.params;
        const { name, description, members, hostId } = req.body;

        try {
            const updatedBookClub = await this.useCase.execute(
                bookclubId,
                name,
                description,
                members,
                hostId
            );

            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(updatedBookClub);
        } catch (error) {
            next(error);
        }
    }
}
