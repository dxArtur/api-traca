import { PrismaClient } from "@prisma/client";
import ErrorMessages from "../../../custom/constants/ErrorMessages";
import StatusCode from "../../../custom/constants/StatusCode";
import { RepositoryClient } from "../../../database/prismaClient";
import { AppError } from "../../../errors/AppErrors";
import { ReplyDto } from "../../../dto/PostDto";
import { CommentDto, GetCommentDto } from "../../../dto/CommentDto";

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

    async execute(parentId: string): Promise<{ replies: CommentDto[]}> {
        try {
            if (!parentId) {
                throw new AppError("O ID do comentário é necessário.", StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST);
            }

            const replies = await this.repository.comment.findMany({
                where: {
                    parentId: parentId, // Busca replies para o comentário específico
                },
                include:{
                    commentLikes: true,
                    replies:true,
                }
            });

            //const replyCount = replies.length;

            // Mapeia apenas os replies necessários
            const mappedReplies = replies.map(reply => this.mapReply(reply));

            return {
                replies: mappedReplies, 
            }
        } catch (error) {
            console.error('Erro ao buscar respostas:', error);
            throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
        }
    }

    private mapReply(reply: any): GetCommentDto {
        return {
            id: reply.id,
            content: reply.content,
            createdAt: reply.createdAt,
            authorId: reply.authorId,
            //postId: reply.postId,
            parentId: reply.parentId,
            likeCount: reply.commentLikes.length,
            replyCount: reply.replies.length,
            // Não inclui replies aninhadas
            replies: []
        };
    }
}