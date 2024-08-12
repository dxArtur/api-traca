import { PrismaClient } from "@prisma/client"
import { RepositoryClient } from "../../../database/prismaClient"
import { AppError } from "../../../errors/AppErrors"
import ErrorMessages from "../../../custom/constants/ErrorMessages"
import StatusCode from "../../../custom/constants/StatusCode"
import { JwtHelper } from "../../../utils/JwtHelper"
import { GetUserByIdUseCase } from "../getById/getUserByIdUseCase"



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

    async execute(authHeader: string) {
        const token = authHeader.split(' ')[1]
        
        const sub = await JwtHelper.verify(token)
        try {
            if (!sub) {
                throw new AppError(ErrorMessages.USER_NOT_FOUND, StatusCode.STATUS_CODE_CLIENT.NOT_FOUND)
            }
            const getUser = GetUserByIdUseCase.getInstance()
            const user = await getUser.execute(sub)
            return user
        } catch (error) {
            throw error
        }
 
        


    }

}