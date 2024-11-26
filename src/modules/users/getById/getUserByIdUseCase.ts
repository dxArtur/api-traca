import { PrismaClient } from "@prisma/client"
import { RepositoryClient } from "../../../database/prismaClient" 
import { AppError } from "../../../errors/AppErrors"
import { sanitizedOutputSignin, UserDto } from "../../../dto/UserDto"
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

    async execute(userId: string): Promise<sanitizedOutputSignin>{
        try {
            const user = await this.repository.user.findUniqueOrThrow({
                where: {
                    id: userId
                },
                select: {
                    id:true,
                    name:true,
                    nick:true,
                    email:true,
                    profilePicture:true,
                    posts:true,
                    followers:true,
                    _count: {
                        select: {
                            posts:true,
                            followers:true
                        },
                    }
                }
            })
            if (!user) {
                throw new AppError(ErrorMessages.USER_NOT_FOUND, StatusCode.STATUS_CODE_CLIENT.NOT_FOUND)
            }

            const sanitizedUser: sanitizedOutputSignin = {
                id: user.id,
                email: user.email,
                name: user.name,
                nick: user.nick,
                profilePicture: user.profilePicture,
                followersCount: user._count.followers,  
                postsCount: user._count.posts,  
            };

            return sanitizedUser
        } catch (error) {
            throw error
        }
    }
}