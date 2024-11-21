import { PrismaClient } from "@prisma/client";
import { AppError } from "../../../errors/AppErrors";
import StatusCode from "../../../custom/constants/StatusCode";
import ErrorMessages from "../../../custom/constants/ErrorMessages";
import { RepositoryClient } from "../../../database/prismaClient";

export class UseCase {
    private static instance: UseCase;
    private repository: PrismaClient;

    constructor(repository: PrismaClient) {
        this.repository = repository;
    }

    public static getInstance() {
        if (!UseCase.instance) {
            UseCase.instance = new UseCase(RepositoryClient.getInstance());
        }
        return UseCase.instance;
    }

    // Aqui vamos permitir um filtro opcional pelo autor (authorReviewId)
    async execute(authorReviewId?: string) {
        try {
            const reviews = authorReviewId
                ? await this.repository.rating.findMany({
                      where: { authorId: authorReviewId },
                      include: {
                          book: true, // Inclui o livro associado à avaliação
                      },
                  })
                : await this.repository.rating.findMany({
                      include: {
                          book: true, // Inclui o livro associado à avaliação
                      },
                  });

/*             if (reviews.length === 0) {
                throw new AppError(
                    ErrorMessages.REVIEWS_NOT_FOUND,
                    StatusCode.STATUS_CODE_CLIENT.NOT_FOUND
                );
            } */

            return reviews;
        } catch (error) {
            console.error("Erro ao buscar as avaliações:", error);

            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(
                ErrorMessages.INTERNAL_ERROR_SERVER,
                StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR
            );
        }
    }
}
