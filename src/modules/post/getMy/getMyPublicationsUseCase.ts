import { PrismaClient } from "@prisma/client";
import ErrorMessages from "../../../custom/constants/ErrorMessages";
import StatusCode from "../../../custom/constants/StatusCode";
import { RepositoryClient } from "../../../database/prismaClient";
import { AppError } from "../../../errors/AppErrors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

    async execute(userId:string) {
        try {
            const myPublications = await this.repository.post.findMany({
                where: {
                    authorId: userId,
                },
                include: {
                    // Incluindo informações de curtidas e comentários
                    _count: {
                        select: {
                            likes: true, // Contagem de curtidas
                            comments: true, // Contagem de comentários
                        },
                    },
                    likes: {
                        select: {
                            userId: true, // IDs dos usuários que curtiram a publicação
                        },
                    },
                },
            });

            // Formatando os resultados conforme a tipagem esperada
            const formattedPublications = myPublications.map(publication => ({
                id: publication.id,
                content: publication.content,
                createdAt: publication.createdAt.toISOString(),
                updatedAt: publication.updatedAt.toISOString(),
                authorId: publication.authorId,
                likesCount: publication._count.likes, // Contagem de curtidas
                commentCount: publication._count.comments, // Contagem de comentários
                userIdsWhoLiked: publication.likes.map(like => like.userId), // IDs dos usuários que curtiram
            }));

            return formattedPublications
        } catch (error) {
            throw error
        }
    }
}