import { Request, Response, NextFunction } from "express";
import { UseCase } from "./getReviewUseCase";
import StatusCode from "../../../custom/constants/StatusCode";

export class GetReviewController {
    private static instance: GetReviewController;
    private useCase: UseCase;

    constructor(useCase: UseCase) {
        this.useCase = useCase;
    }

    public static getInstance() {
        if (!GetReviewController.instance) {
            GetReviewController.instance = new GetReviewController(UseCase.getInstance());
        }
        return GetReviewController.instance;
    }

    // Handler para buscar a review
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { authorReviewId, title } = req.query;

            if (typeof authorReviewId !== "string" || typeof title !== "string") {
                return res.status(StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST).json({
                    message: "authorReviewId e title são obrigatórios e devem ser strings",
                });
            }

            const review = await this.useCase.execute(authorReviewId, title);
            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(review);
        } catch (error) {
            next(error);
        }
    }
}
