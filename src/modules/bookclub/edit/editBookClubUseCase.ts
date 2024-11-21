import { PrismaClient } from "@prisma/client";
import { AppError } from "../../../errors/AppErrors";
import { RepositoryClient } from "../../../database/prismaClient";
import ErrorMessages from "../../../custom/constants/ErrorMessages";
import StatusCode from "../../../custom/constants/StatusCode";

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

    async execute(clubId: string, name: string, description: string | null, members: string[], hostId: string) {
        try {
            const existingClub = await this.repository.bookClub.findUnique({
                where: { id: clubId },
                include: { members: true },
            });

            if (!existingClub) {
                throw new AppError(
                    ErrorMessages.BOOK_CLUB_NOT_FOUND,
                    StatusCode.STATUS_CODE_CLIENT.NOT_FOUND
                );
            }
            const updatedBookClub = await this.repository.bookClub.update({
                where: { id: clubId },
                data: {
                    name,
                    description,
                    hostId: hostId,  // Caso queira atualizar o host (geralmente não necessário)
                },
            });

            // Atualizar os membros (substituindo a lista de membros, por exemplo)
            // Remover membros antigos
            await this.repository.clubMember.deleteMany({
                where: { clubId },
            });

            // Adicionar novos membros
            for (const userId of members) {
                await this.repository.clubMember.create({
                    data: {
                        userId,
                        clubId: updatedBookClub.id
                    }
                });
            }

            return updatedBookClub;
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
