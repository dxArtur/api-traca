import { PrismaClient } from "@prisma/client"
import { RepositoryClient } from "../../../database/prismaClient"
import { AppError } from "../../../errors/AppErrors"
import ErrorMessages from "../../../custom/constants/ErrorMessages"
import StatusCode from "../../../custom/constants/StatusCode"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"



export class UseCase {
    private static instance: UseCase
    private repository: PrismaClient

    constructor(repository: PrismaClient) {
        this.repository = repository
    }

    public static getInstance() {
        if (!UseCase.instance) {
            UseCase.instance = new UseCase(RepositoryClient.getInstance())
        }
        return UseCase.instance
    }

    async execute(username: string) {
        try {
            const user = await this.repository.user.findUniqueOrThrow({
                where: {
                    nick: username
                }
            });
            return user; // Retorna o usuário se encontrado
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // Trata o erro de "não encontrado"
                throw new AppError(ErrorMessages.USER_NOT_FOUND, StatusCode.STATUS_CODE_CLIENT.NOT_FOUND);
            }
            throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
        }
}
}