import { PrismaClient } from "@prisma/client"
import { RepositoryClient } from "../../../database/prismaClient"
import ERROR_MESSAGES from "../../../custom/constants/ErrorMessages"
import STATUS_CODE from "../../../custom/constants/StatusCode"
import { AppError } from "../../../errors/AppErrors"
import { UserDto } from "../../../dto/UserDto"


export class UpdateUserUseCase{
    private static instance: UpdateUserUseCase
    private repository: PrismaClient

    constructor(repository: PrismaClient) {
        this.repository = repository
    }

    public static getInstance() {
        if (!UpdateUserUseCase.instance) {
            UpdateUserUseCase.instance = new UpdateUserUseCase(RepositoryClient.getInstance())
        }

        return UpdateUserUseCase.instance
    }

    async execute(userId: string, dataUpdate: UserDto) {
        try {
            const userExist = await this.repository.user.findUniqueOrThrow({
                where:{
                    id: userId,
                }
            })
            if ( !userExist ) {
                throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODE.STATUS_CODE_CLIENT.NOT_FOUND)
            }

            const userUpdated = await this.repository.user.update({
                where: {
                    id: userId
                },
                data: {
                    email: dataUpdate.email,
                    id: dataUpdate.id,
                    name: dataUpdate.name,
                    password: dataUpdate.password,
                    nick: dataUpdate.nick
                }
            })

            return userUpdated
        } catch(error) {
            throw error
        }
    }
}