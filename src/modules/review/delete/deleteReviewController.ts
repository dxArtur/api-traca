import { Request, Response, NextFunction } from "express";
import { UseCase } from "./deleteReviewUseCase";
import StatusCode from "../../../custom/constants/StatusCode";

export class DeleteReviewController {
    private static instance: DeleteReviewController;
    private useCase: UseCase;

    constructor(useCase: UseCase) {
        this.useCase = useCase;
    }

    public static getInstance() {
        if (!DeleteReviewController.instance) {
            DeleteReviewController.instance = new DeleteReviewController(UseCase.getInstance());
        }
        return DeleteReviewController.instance;
    }

    // Handler para deletar uma review
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { reviewId } = req.params;

            // Verifica se o ID foi passado
            if (!reviewId) {
                return res.status(StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST).json({
                    message: "reviewId é obrigatório",
                });
            }

            // Chama o UseCase para deletar a avaliação
            const response = await this.useCase.execute(reviewId);

            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
}
