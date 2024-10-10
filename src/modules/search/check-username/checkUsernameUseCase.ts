import { PrismaClient } from "@prisma/client"
import ErrorMessages from "../../../custom/constants/ErrorMessages"
import StatusCode from "../../../custom/constants/StatusCode"
import { RepositoryClient } from "../../../database/prismaClient"
import { UserDto } from "../../../dto/UserDto"
import { AppError } from "../../../errors/AppErrors"

export class CheckUsernameUseCase{
    private static instance: CheckUsernameUseCase
    private repository: PrismaClient

    constructor(repository: PrismaClient) {
        this.repository= repository
    }

    public static getInstance() {
        if (!CheckUsernameUseCase.instance) {
            CheckUsernameUseCase.instance = new CheckUsernameUseCase(RepositoryClient.getInstance())
        }

        return CheckUsernameUseCase.instance
    }

    async execute(query: string): Promise<Boolean>{
        try {
            const user = await this.repository.user.findUnique({
                where: {
                    nick: query
                }
            })
            return user === null
        } catch (error) {
            throw error
        }
    }
}