import { PrismaClient } from "@prisma/client"
import ErrorMessages from "../../../custom/constants/ErrorMessages"
import StatusCode from "../../../custom/constants/StatusCode"
import { RepositoryClient } from "../../../database/prismaClient"
import { UserDto } from "../../../dto/UserDto"
import { AppError } from "../../../errors/AppErrors"
import { PostDto } from "../../../dto/PostDto"

export class UseCase{
    private static instance: UseCase
    private repository: PrismaClient

    constructor(repository: PrismaClient) {
        this.repository= repository
    }

    public static getInstance() {
        if (!UseCase.instance) {
            UseCase.instance = new UseCase(RepositoryClient.getInstance())
        }

        return UseCase.instance
    }

    async execute(): Promise<PostDto[]>{
        try {
            const allPosts = await this.repository.post.findMany({
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            nick: true,
                        },
                    },
                }
            });

            return allPosts;
        } catch (error) {
            console.error('Erro ao listar postagens:', error);

            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
        }
    }

}