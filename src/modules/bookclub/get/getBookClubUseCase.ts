// useCases/getBookClubById/GetBookClubByIdUseCase.ts

import { PrismaClient } from "@prisma/client";
import { AppError } from "../../../errors/AppErrors";
import StatusCode from "../../../custom/constants/StatusCode";
import ErrorMessages from "../../../custom/constants/ErrorMessages";

export class UseCase {
    private static instance: UseCase;
    private repository: PrismaClient;

    constructor(repository: PrismaClient) {
        this.repository = repository;
    }

    public static getInstance() {
        if (!UseCase.instance) {
            UseCase.instance = new UseCase(new PrismaClient());
        }

        return UseCase.instance;
    }

    async execute(bookclubId: string) {
        try {
            const bookClub = await this.repository.bookClub.findUnique({
                where: { id: bookclubId },
                include: {
                    members: true,  // Incluir membros do clube
                    books: true,    // Incluir livros associados ao clube
                    host: true      // Incluir o host do clube
                }
            });

            if (!bookClub) {
                throw new AppError(
                    ErrorMessages.BOOK_CLUB_NOT_FOUND,
                    StatusCode.STATUS_CODE_CLIENT.NOT_FOUND
                );
            }

            return bookClub;
        } catch (error) {
            console.error('Erro ao buscar clube de livro por ID:', error);
            throw error
        }
    }
}
