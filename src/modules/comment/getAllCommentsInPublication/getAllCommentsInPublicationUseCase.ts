import { PrismaClient } from "@prisma/client"
import ErrorMessages from "../../../custom/constants/ErrorMessages"
import StatusCode from "../../../custom/constants/StatusCode"
import { RepositoryClient } from "../../../database/prismaClient"
import { UserDto } from "../../../dto/UserDto"
import { AppError } from "../../../errors/AppErrors"
import { PostDto, ReplyDto } from "../../../dto/PostDto"
import { CommentDto, RepliesCommentDto } from "../../../dto/CommentDto"

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

    async execute(publicationId: string): Promise<RepliesCommentDto[]> {
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
                            author: true, // Inclui autor das replies     
                            _count: {
                                select: { commentLikes: true } // Contagem de likes nas replies
                            },
                            commentLikes: {
                                select: {
                                    userId: true, // Apenas o ID do usuário que deu like
                                },
                            },
                        },
                    },
                    author: true, // Inclui autor dos comentários principais
                    _count: {
                        select: { commentLikes: true }
                    },
                    commentLikes: {
                        select: {
                            userId: true, // Inclui os IDs dos usuários que curtiram o comentário
                        },
                    },
                },
            });

            return await Promise.all(comments.map(comment => this.mapComment(comment)));
        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
            throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
        }
    }

    private async mapComment(comment: any): Promise<RepliesCommentDto> {
        const replies = comment.replies || [];

        // Mapeia replies de forma recursiva
        const mappedReplies = await Promise.all(replies.map(async (reply: any) => {
            return {
                id: reply.id,
                content: reply.content,
                createdAt: reply.createdAt,
                likesCount: reply._count,
                userIdsWhoLiked: reply.commentLikes.map((like: {userId: string}) => like.userId),
                author: reply.author ? {
                    id: reply.author.id,
                    name: reply.author.name,
                    nick: reply.author.nick,
                } : null,
                parentId: reply.parentId,
                replies: [], // Pode-se adicionar lógica aqui para replies aninhadas
            };
        }));

        return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            authorId: comment.authorId,
            likeCount:comment._count.commentLikes,
            userIdsWhoLiked: comment?.commentLikes.map((like: {userId: string}) => like.userId),
            author: {
                id: comment.author.id,
                name: comment.author.name,
                nick: comment.author.nick,
            },
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