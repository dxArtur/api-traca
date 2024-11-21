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

    // O método de deletar uma avaliação, baseado no ID
    async execute(reviewId: string) {
        try {
            // Verifica se a avaliação existe
            const review = await this.repository.rating.findUnique({
                where: { id: reviewId },
            });

            if (!review) {
                throw new AppError(
                    ErrorMessages.REVIEW_NOT_FOUND,
                    StatusCode.STATUS_CODE_CLIENT.NOT_FOUND
                );
            }

            // Deleta a avaliação
            await this.repository.rating.delete({
                where: { id: reviewId },
            });

            return { message: "Avaliação deletada com sucesso" };
        } catch (error) {
            console.error("Erro ao deletar a avaliação:", error);

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
