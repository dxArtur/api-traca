import { Request, Response, NextFunction } from "express";
import { UseCase } from "./getAllReviewUseCase";
import StatusCode from "../../../custom/constants/StatusCode";

export class GetAllReviewsController {
    private static instance: GetAllReviewsController;
    private useCase: UseCase;

    constructor(useCase: UseCase) {
        this.useCase = useCase;
    }

    public static getInstance() {
        if (!GetAllReviewsController.instance) {
            GetAllReviewsController.instance = new GetAllReviewsController(UseCase.getInstance());
        }
        return GetAllReviewsController.instance;
    }

    // Handler para buscar todas as avaliações
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            // Verifica se foi passado o parâmetro 'authorReviewId' na query string
            const { authorReviewId } = req.query;

            // Se o parâmetro não for uma string, retorna erro
            if (authorReviewId && typeof authorReviewId !== "string") {
                return res.status(StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST).json({
                    message: "authorReviewId deve ser uma string",
                });
            }

            const reviews = await this.useCase.execute(authorReviewId as string | undefined);
            return res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(reviews);
        } catch (error) {
            next(error);
        }
    }
}
