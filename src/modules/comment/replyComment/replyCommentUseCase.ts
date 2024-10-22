import { PrismaClient } from "@prisma/client"
import ErrorMessages from "../../../custom/constants/ErrorMessages"
import StatusCode from "../../../custom/constants/StatusCode"
import { RepositoryClient } from "../../../database/prismaClient"
import { UserDto } from "../../../dto/UserDto"
import { AppError } from "../../../errors/AppErrors"
import { PostDto, ReplyDto } from "../../../dto/PostDto"
import { CommentDto, RepliesCommentDto } from "../../../dto/CommentDto"

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

    async execute({content, publicationId, authorId, parentId}:ReplyDto): Promise<RepliesCommentDto>{
        try {

            if (!publicationId) {
                throw new AppError("O ID da publicação é necessário.", StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST);
            }

            if (!parentId){
                throw new AppError("O ID do comentário que se está respondendo é necessário.", StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST);
            }

            await this.repository.comment.create({
                data: {
                    content: content,
                    authorId: authorId,
                    postId: publicationId,
                    parentId: parentId
                },
            });

            // Busca o comentário pai junto com suas replies
            const parentComment = await this.repository.comment.findUnique({
                where: { id: parentId },
                include: { replies: true, author: true } // Inclui as replies do comentário pai
            });

            if (!parentComment) {
                throw new AppError("Comentário pai não encontrado.", StatusCode.STATUS_CODE_CLIENT.NOT_FOUND);
            }

            // Retorna o comentário pai com as replies
            return {
                id: parentComment?.id,
                content: parentComment?.content,
                createdAt: parentComment?.createdAt,
                authorId:parentComment.authorId,
                author: {
                    id: parentComment.author.id,
                    name: parentComment.author.name,
                    nick: parentComment.author.nick
                },
                //authorId: parentComment?.authorId,
                //postId: parentComment?.postId,
                parentId: parentComment.parentId ?? undefined,
                /* replies: parentComment?.replies.map(reply => ({
                    id: reply.id,
                    content: reply.content,
                    createdAt: reply.createdAt,
                    authorId: reply.authorId,
                    postId: reply.postId,
                    parentId: reply.parentId ?? undefined,
                    replies:[]
                })) || [] */ // Garante que será um array vazio se não houver replies
            }


        } catch (error) {
            console.error('Erro ao criar postagem:', error);

            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
        }
    }

}