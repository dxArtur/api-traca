import { PrismaClient } from "@prisma/client"
import { RepositoryClient } from "../../../database/prismaClient" 
import { AppError } from "../../../errors/AppErrors"
import { UserDto } from "../../../dto/UserDto"
import ERROR_MESSAGES from "../../../custom/constants/ErrorMessages"
import STATUS_CODE from "../../../custom/constants/StatusCode"

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
                throw new AppError(ERROR_MESSAGES.USER_ALREADY_EXIST, STATUS_CODE.STATUS_CODE_CLIENT.BAD_REQUEST)
            }

            return user
        } catch (error) {
            throw error
        }
    }
}