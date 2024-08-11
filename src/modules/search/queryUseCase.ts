import { PrismaClient } from "@prisma/client"
import ErrorMessages from "../../custom/constants/ErrorMessages"
import StatusCode from "../../custom/constants/StatusCode"
import { RepositoryClient } from "../../database/prismaClient"
import { UserDto } from "../../dto/UserDto"
import { AppError } from "../../errors/AppErrors"

export class QueryUseCase{
    private static instance: QueryUseCase
    private repository: PrismaClient

    constructor(repository: PrismaClient) {
        this.repository= repository
    }

    public static getInstance() {
        if (!QueryUseCase.instance) {
            QueryUseCase.instance = new QueryUseCase(RepositoryClient.getInstance())
        }

        return QueryUseCase.instance
    }

    async execute(query: string): Promise<UserDto[]>{
        try {
            const response = await this.repository.user.findMany({
                where: {
                    nick: {
                        contains: query
                    }
                }
            })
            if (!response) {
                throw new AppError(ErrorMessages.USER_NOT_FOUND, StatusCode.STATUS_CODE_CLIENT.NOT_FOUND)
            }

            return response
        } catch (error) {
            throw error
        }
    }
}