import { PrismaClient } from "@prisma/client";
import ErrorMessages from "../../../custom/constants/ErrorMessages";
import StatusCode from "../../../custom/constants/StatusCode";
import { RepositoryClient } from "../../../database/prismaClient";
import { AppError } from "../../../errors/AppErrors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

    async execute(title:string, authorName:string) {
        try {
            const verifyBookExist = await this.repository.book.findUnique({
                where: {
                  title_author: {
                    title: title,
                    author: authorName,
                  }
                }
              })

            if (verifyBookExist) {
                throw new AppError(ErrorMessages.REVIEW_ALREADY_EXISTS, StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST)
            }

            const newBook = await this.repository.book.create({
                data: {
                  title: title,
                  author: authorName,
                }
              })

            return newBook
        } catch (error) {
            console.error('Erro durante a criação do livro:', error);

            // Tratar erros específicos do Prisma
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new AppError(ErrorMessages.DUPLICATE_ENTRY, StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST);
                }
                throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
            }

            // Se o erro for de outro tipo
            if (error instanceof AppError) {
                throw error;
            }

            // Caso erro desconhecido
            throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
        }
    }
}