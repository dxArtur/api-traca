import { Request, Response, NextFunction } from "express";
import { GetReviewsUseCase } from "./getReviewByUserUseCase";
import { AppError } from "../../../errors/AppErrors";
import StatusCode from "../../../custom/constants/StatusCode";

export class GetReviewsController {
  private static instance: GetReviewsController;

  private constructor() {}

  public static getInstance() {
    if (!GetReviewsController.instance) {
      GetReviewsController.instance = new GetReviewsController();
    }

    return GetReviewsController.instance;
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    const { authorReviewId } = req.params;

    try {
      // Verifica se o ID do autor está presente
      if (!authorReviewId) {
        throw new AppError("Author ID is required", StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST);
      }

      // Chama o caso de uso para obter todas as reviews do autor
      const reviews = await GetReviewsUseCase.getInstance().execute(authorReviewId);

      // Retorna as reviews com sucesso
      res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(reviews);
    } catch (error) {
      next(error); // Passa o erro para o handler de erros global
    }
  }
}
