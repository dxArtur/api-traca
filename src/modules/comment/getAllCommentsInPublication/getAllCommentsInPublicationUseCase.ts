import { PrismaClient } from "@prisma/client"
import ErrorMessages from "../../../custom/constants/ErrorMessages"
import StatusCode from "../../../custom/constants/StatusCode"
import { RepositoryClient } from "../../../database/prismaClient"
import { UserDto } from "../../../dto/UserDto"
import { AppError } from "../../../errors/AppErrors"
import { PostDto, ReplyDto } from "../../../dto/PostDto"
import { CommentDto } from "../../../dto/CommentDto"

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

    async execute(publicationId: string): Promise<CommentDto[]> {
        try {

            if (!publicationId) {
                throw new AppError("O ID da publicação é necessário.", StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST);
            }
            const comments = await this.repository.comment.findMany({
                where: {
                    postId: publicationId,
                    parentId: null, // Apenas comentários principais
                },
                include: {
                    replies: {
                        include: {
                            replies: true, // Inclui replies das replies
                        }
                    }
                }
            });

            return await Promise.all(comments.map(comment => this.mapComment(comment)))

            
        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
            throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
        }
    }

    private async mapComment(comment: any): Promise<CommentDto> {
        const replies = comment.replies || [];

        // Mapeia replies de forma recursiva
        const mappedReplies = await Promise.all(replies.map(async (reply: any) => {
            // Carrega replies das replies
            const nestedReplies = await this.repository.comment.findMany({
                where: { parentId: reply.id },
                include: { replies: true }, // Inclui replies para as replies
            });

            // Adiciona as replies aninhadas
            reply.replies = nestedReplies;
            return this.mapComment(reply); // Mapeia a reply
        }));

        return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            authorId: comment.authorId,
            postId: comment.postId,
            parentId: comment.parentId,
            replies: mappedReplies,
        };
    }
}


/* return comments.map(comment => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                authorId: comment.authorId,
                postId: comment.postId,
                parentId: comment.parentId,
                replies: comment.replies.map(reply => ({
                    id: reply.id,
                    content: reply.content,
                    createdAt: reply.createdAt,
                    authorId: reply.authorId,
                    postId: reply.postId,
                    parentId: reply.parentId,
                })),
            })) as CommentDto[]; */