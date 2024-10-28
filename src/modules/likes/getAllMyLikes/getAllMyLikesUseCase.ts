import { PrismaClient } from "@prisma/client";
import ErrorMessages from "../../../custom/constants/ErrorMessages";
import StatusCode from "../../../custom/constants/StatusCode";
import { AppError } from "../../../errors/AppErrors";
import { RepositoryClient } from "../../../database/prismaClient"


export class UseCase {
    private static instance: UseCase
    private repository: PrismaClient;

    constructor(repository: PrismaClient) {
        this.repository = repository;
    }

    public static getInstance() {
        if (!UseCase.instance) {
            UseCase.instance = new UseCase(RepositoryClient.getInstance())
        }

        return UseCase.instance
    }

    async execute(userId:string) {
        try {
            const likedComments = await this.repository.commentLike.findMany({
                where: {
                    userId: userId,
                },
                select: {
                    commentId: true, // Apenas o ID do comentário
                },
            });

            // Busca os posts curtidos pelo usuário
            const likedPosts = await this.repository.like.findMany({
                where: {
                    userId: userId,
                },
                select: {
                    postId: true, // Apenas o ID do post
                },
            })
    
            return {
                likedComments: likedComments.map(({ commentId }) => commentId),
                likedPosts: likedPosts.map(({ postId }) => postId),
            }
        } catch (error) {
            console.error('Erro ao curtir a publicação:', error);
            throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
        }
    }
}