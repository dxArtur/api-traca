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

    async execute(parentId:string, authorId:string): Promise<{ status: number }> {
        try {
            const parent = await this.repository.comment.findUnique({
                where: { id: parentId },
            });

            if (!parent) {
                throw new AppError("Publicação não encontrada.", StatusCode.STATUS_CODE_CLIENT.NOT_FOUND);
            }

            // Verifica se o usuário já curtiu a publicação
            const existingLike = await this.repository.commentLike.findUnique({
                where: {
                    userId_commentId: {
                        userId: authorId,
                        commentId: parentId,
                    },
                },
            });

            if (existingLike) {
                await this.repository.commentLike.delete({
                    where: {
                        userId_commentId: {
                            userId: authorId,
                            commentId: parentId,
                        },
                    },
                })

                return { status: StatusCode.STATUS_CODE_SUCESS.OK };
            } else {
                // Adiciona uma nova curtida
                await this.repository.commentLike.create({
                    data: {
                        userId: authorId,
                        commentId: parentId,
                    },
                })

                return { status: StatusCode.STATUS_CODE_SUCESS.CREATED };
            }
        } catch (error) {
            console.error('Erro ao curtir a publicação:', error);
            throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
        }
    }
}