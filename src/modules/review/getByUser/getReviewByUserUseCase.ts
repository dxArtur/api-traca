import { PrismaClient } from "@prisma/client";
import { RepositoryClient } from "../../../database/prismaClient";
import { AppError } from "../../../errors/AppErrors";
import ErrorMessages from "../../../custom/constants/ErrorMessages";
import StatusCode from "../../../custom/constants/StatusCode";

export class GetReviewsUseCase {
  private static instance: GetReviewsUseCase;
  private repository: PrismaClient;

  constructor(repository: PrismaClient) {
    this.repository = repository;
  }

  public static getInstance() {
    if (!GetReviewsUseCase.instance) {
      GetReviewsUseCase.instance = new GetReviewsUseCase(RepositoryClient.getInstance());
    }

    return GetReviewsUseCase.instance;
  }

  async execute(authorReviewId: string) {
    try {
      // Busca todas as avaliações feitas pelo autor específico
      const reviews = await this.repository.rating.findMany({
        where: {
          authorId: authorReviewId,
        },
        include: {
          book: true, // Inclui as informações do livro associado a cada avaliação
        },
      });

      return reviews;
    } catch (error) {
      throw error;
    }
  }
}
