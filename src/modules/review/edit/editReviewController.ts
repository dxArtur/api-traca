import { Request, Response, NextFunction } from "express";
import { UseCase } from "./editReviewUseCase";
import StatusCode from "../../../custom/constants/StatusCode";

export class EditReviewController {
    private static instance: EditReviewController;
    private useCase: UseCase;

    constructor(useCase: UseCase) {
        this.useCase = useCase;
    }

    public static getInstance() {
        if (!EditReviewController.instance) {
            EditReviewController.instance = new EditReviewController(UseCase.getInstance());
        }

        return EditReviewController.instance;
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { authorReviewId, title, review } = req.body;
            const response = await this.useCase.execute(authorReviewId, title, review);
            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
}
