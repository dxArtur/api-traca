import { PrismaClient } from "@prisma/client"
import ErrorMessages from "../../../custom/constants/ErrorMessages"
import StatusCode from "../../../custom/constants/StatusCode"
import { RepositoryClient } from "../../../database/prismaClient"
import { UserDto } from "../../../dto/UserDto"
import { AppError } from "../../../errors/AppErrors"
import { GetPostDto, PostDto } from "../../../dto/PostDto"

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

    async execute(): Promise<GetPostDto[]>{
        try {
            const allPosts = await this.repository.post.findMany({
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            nick: true,
                            profilePicture: true,
                        },
                    },
                    likes: {
                        select: {
                            userId: true, 
                        },
                    },
                    comments: true
                }
            });

            return allPosts.map(post => ({
                id: post.id,
                content: post.content,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                author: {
                    id: post.author.id,
                    name: post.author.name,
                    nick: post.author.nick,
                    profilePicture: post.author.profilePicture
                },
                userIdsWhoLiked: post.likes.map(like => like.userId),
                likesCount: post.likes.length, // Conta as curtidas
                commentCount: post.comments.length, // Conta as curtidas
            }))
        } catch (error) {
            throw error
        }
    }

}