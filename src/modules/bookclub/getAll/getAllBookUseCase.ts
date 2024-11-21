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

    async execute() {
        try {
            // Buscar todos os clubes de livros, incluindo membros e livros associados
            const bookClubs = await this.repository.bookClub.findMany({
                include: {
                    members: true,  // Incluir os membros do clube
                    books: true,    // Incluir os livros associados
                    host: true      // Incluir o host do clube
                }
            });

            return bookClubs;
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
