import { PrismaClient } from "@prisma/client";
import ErrorMessages from "../../../custom/constants/ErrorMessages";
import StatusCode from "../../../custom/constants/StatusCode";
import { RepositoryClient } from "../../../database/prismaClient";
import { AppError } from "../../../errors/AppErrors";
import { ReplyDto } from "../../../dto/PostDto";

export class UseCase {
    private static instance: UseCase;
    private repository: PrismaClient;

    constructor(repository: PrismaClient) {
        this.repository = repository;
    }

    public static getInstance() {
        if (!UseCase.instance) {
            UseCase.instance = new UseCase(RepositoryClient.getInstance());
        }

        return UseCase.instance;
    }

    async execute(commentId: string): Promise<{ replies: ReplyDto[], replyCount: number }> {
        try {
            if (!commentId) {
                throw new AppError("O ID do comentário é necessário.", StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST);
            }

            const replies = await this.repository.comment.findMany({
                where: {
                    parentId: commentId, // Busca replies para o comentário específico
                },
            });

            const replyCount = replies.length;

            // Mapeia apenas os replies necessários
            const mappedReplies = replies.map(reply => this.mapReply(reply));

            return {
                replies: mappedReplies,
                replyCount: replyCount, // Retorna a contagem de replies
            };
        } catch (error) {
            console.error('Erro ao buscar respostas:', error);
            throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
        }
    }

    private mapReply(reply: any): ReplyDto {
        return {
            publicationId: reply.id,
            content: reply.content,
            ///createdAt: reply.createdAt,
            authorId: reply.authorId,
            //postId: reply.postId,
            parentId: reply.parentId,
            // Não inclui replies aninhadas
        };
    }
}