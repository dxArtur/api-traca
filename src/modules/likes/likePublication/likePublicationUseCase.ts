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

    async execute(publicationId:string, authorId:string): Promise<void> {
        try {
            const post = await this.repository.post.findUnique({
                where: { id: publicationId },
            });

            if (!post) {
                throw new AppError("Publicação não encontrada.", StatusCode.STATUS_CODE_CLIENT.NOT_FOUND);
            }

            // Verifica se o usuário já curtiu a publicação
            const existingLike = await this.repository.like.findUnique({
                where: {
                    userId_postId: {
                        userId: authorId,
                        postId: publicationId,
                    },
                },
            });

            if (existingLike) {
                await this.repository.like.delete({
                    where: {
                        userId_postId: {
                            userId: authorId,
                            postId: publicationId,
                        },
                    },
                });
            } else {
                // Adiciona uma nova curtida
                await this.repository.like.create({
                    data: {
                        userId: authorId,
                        postId: publicationId,
                    },
                });
            };
        } catch (error) {
            console.error('Erro ao curtir a publicação:', error);
            throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
        }
    }
}