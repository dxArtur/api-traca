import { PrismaClient } from "@prisma/client";
import { AppError } from "../../../errors/AppErrors";
import ErrorMessages from "../../../custom/constants/ErrorMessages";
import StatusCode from "../../../custom/constants/StatusCode";
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

    async execute(authorReviewId: string, bookTitle: string, review: string) {
        try {
            const book = await this.repository.book.findFirst({
                where: {
                    title: bookTitle,
                },
            });

            if (!book) {
                throw new AppError(
                    ErrorMessages.BOOK_NOT_FOUND,
                    StatusCode.STATUS_CODE_CLIENT.NOT_FOUND
                );
            }

            const existingRating = await this.repository.rating.findUnique({
                where: {
                    authorId_bookId: {
                        authorId: authorReviewId,
                        bookId: book.id,
                    },
                },
            });

            if (!existingRating) {
                throw new AppError(
                    ErrorMessages.REVIEW_NOT_FOUND,
                    StatusCode.STATUS_CODE_CLIENT.NOT_FOUND
                );
            }

            const updatedRating = await this.repository.rating.update({
                where: {
                    id: existingRating.id,
                },
                data: {
                    review: review,
                },
            });

            return updatedRating;

        } catch (error) {
            console.error("Erro ao editar a avaliação:", error);

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
