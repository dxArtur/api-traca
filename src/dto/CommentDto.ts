export interface CommentDto {
    id?: string;           // ID do comentário
    content: string;     // Conteúdo do comentário
    createdAt: Date;     // Data de criação do comentário
    authorId: string;    // ID do autor do comentário
    postId?: string;      // ID do post ao qual o comentário pertence
    parentId?: string;   // ID do comentário pai (opcional)
    replies?: CommentDto[]; // Respostas ao comentário
}

export interface CreatedCommentDto {
    id: string;           // ID do comentário
    content: string;     // Conteúdo do comentário
    createdAt: Date;     // Data de criação do comentário
    authorId: string;    // ID do autor do comentário
    parentId?: string | null;   // ID do comentário pai (opcional)
}


export interface GetCommentDto {
    id?: string;           // ID do comentário
    content: string;     // Conteúdo do comentário
    createdAt: Date;     // Data de criação do comentário
    authorId: string;    // ID do autor do comentário
    postId?: string;      // ID do post ao qual o comentário pertence
    parentId?: string;   // ID do comentário pai (opcional)
    replies?: CommentDto[]; // Respostas ao comentário
    likeCount: number;
    replyCount?: number;
}