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

    async execute(authorReviewId: string, bookTitle: string) {
        try {
            // Verificar se o livro existe
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

            // Verificar se a avaliação existe para esse livro e autor
            const review = await this.repository.rating.findUnique({
                where: {
                    authorId_bookId: {
                        authorId: authorReviewId,
                        bookId: book.id,
                    },
                },
            });

            if (!review) {
                throw new AppError(
                    ErrorMessages.REVIEW_NOT_FOUND,
                    StatusCode.STATUS_CODE_CLIENT.NOT_FOUND
                );
            }

            // Retornar a avaliação
            return review;

        } catch (error) {
            console.error("Erro ao buscar a avaliação:", error);

            // Lançar o erro apropriado
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
