import { Request, Response, NextFunction } from "express";
import { UseCase } from "./getReviewByUserUseCase";
import { AppError } from "../../../errors/AppErrors";
import StatusCode from "../../../custom/constants/StatusCode";

export class GetReviewByUserController {
  private static instance: GetReviewByUserController;
  private useCase: UseCase

  private constructor(useCase: UseCase) {
    this.useCase=useCase
  }

  public static getInstance() {
    if (!GetReviewByUserController.instance) {
      GetReviewByUserController.instance = new GetReviewByUserController(UseCase.getInstance());
    }

    return GetReviewByUserController.instance;
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    const authorId = req.params.authorId

    try {
      // Verifica se o ID do autor está presente
      if (!authorId) {
        throw new AppError("Author ID is required", StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST);
      }

      // Chama o caso de uso para obter todas as reviews do autor
      const response = await this.useCase.execute(authorId)

      // Retorna as reviews com sucesso
      res.status(StatusCode.STATUS_CODE_SUCESS.OK).json(response);
    } catch (error) {
      next(error); // Passa o erro para o handler de erros global
    }
  }
}
