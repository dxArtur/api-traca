import { PrismaClient } from "@prisma/client"
import { RepositoryClient } from "../../../database/prismaClient"
import { AppError } from "../../../errors/AppErrors"
import ErrorMessages from "../../../custom/constants/ErrorMessages"
import StatusCode from "../../../custom/constants/StatusCode"



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
            })
            if (!user) {
                throw new AppError(ErrorMessages.USER_NOT_FOUND, StatusCode.STATUS_CODE_CLIENT.NOT_FOUND)
            }

            return user
        } catch (error) {
            throw error
        }
    }
}