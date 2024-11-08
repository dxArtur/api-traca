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

    async execute(userId:string) {
        try {
            const myPublications = await this.repository.post.findMany({
                where: {
                  authorId: userId
                }
              })

            return myPublications
        } catch (error) {
            console.error('Erro durante a consulta de publicações:', error);
            // Se o erro for de outro tipo
            if (error instanceof AppError) {
                throw error;
            }

            // Caso erro desconhecido
            throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
        }
    }
}