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

    async execute({content, publicationId, authorId}:PostDto): Promise<PostDto>{
        try {

            if (!publicationId) {
                throw new AppError("O ID da publicação é necessário.", StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST);
            }

            const newCommentInPublication = await this.repository.comment.create({
                data: {
                    content: content,
                    authorId: authorId,
                    postId: publicationId,
                },
            });

            return newCommentInPublication
        } catch (error) {
            console.error('Erro ao criar postagem:', error);

            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
        }
    }

}