import { PrismaClient } from "@prisma/client"
import { RepositoryClient } from "../../../database/prismaClient" 
import { AppError } from "../../../errors/AppErrors"
import { UserDto } from "../../../dto/UserDto"
import ErrorMessages from "../../../custom/constants/ErrorMessages"
import StatusCode from "../../../custom/constants/StatusCode"

export class GetUserByIdUseCase{
    private static instance: GetUserByIdUseCase
    private repository: PrismaClient

    constructor(repository: PrismaClient) {
        this.repository= repository
    }

    public static getInstance() {
        if (!GetUserByIdUseCase.instance) {
            GetUserByIdUseCase.instance = new GetUserByIdUseCase(RepositoryClient.getInstance())
        }

        return GetUserByIdUseCase.instance
    }

    async execute(userId: string): Promise<UserDto>{
        try {
            const user = await this.repository.user.findUniqueOrThrow({
                where: {
                    id: userId
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