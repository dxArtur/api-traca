import { LikeDto } from "./LikeDto";

export interface PostDto{
    publicationId?:string;
    content: string;
    authorId: string;
}

export interface GetPostDto {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author: {
        id: string;
        name: string;
        nick: string;
    };
    likesCount: number; // Novo campo para a contagem de curtidas
    commentCount: number; // Novo campo para a contagem de curtidas
}


export interface ReplyDto{
    publicationId?:string;
    content: string;
    authorId: string;
    parentId:string;
}