import { Request, Response, NextFunction } from "express";
import { useCase } from "./createBookClubeUseCase";
import StatusCode from "../../../custom/constants/StatusCode";

export class CreateBookClubController {
    private static instance: CreateBookClubController;
    private useCase: useCase;

    constructor(useCase: useCase) {
        this.useCase = useCase;
    }

    public static getInstance() {
        if (!CreateBookClubController.instance) {
            CreateBookClubController.instance = new CreateBookClubController(useCase.getInstance());
        }

        return CreateBookClubController.instance;
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, members, hostId } = req.body;

            if (!members || members.length === 0 || members.length > 3) {
                return res.status(StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST).json({
                    message: "Você deve fornecer de 1 a 3 IDs de usuários."
                });
            }

            const bookClub = await this.useCase.execute(name, description, members, hostId);

            return res.status(StatusCode.STATUS_CODE_SUCESS.CREATED).json(bookClub);
        } catch (error) {
            next(error);
        }
    }
}