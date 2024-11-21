import { PrismaClient } from "@prisma/client";
import { AppError } from "../../../errors/AppErrors";
import { RepositoryClient } from "../../../database/prismaClient";
import ErrorMessages from "../../../custom/constants/ErrorMessages";
import StatusCode from "../../../custom/constants/StatusCode";

export class useCase {
    private static instance: useCase;
    private repository: PrismaClient;

    constructor(repository: PrismaClient) {
        this.repository = repository;
    }

    public static getInstance() {
        if (!useCase.instance) {
            useCase.instance = new useCase(RepositoryClient.getInstance());
        }

        return useCase.instance;
    }

    async execute(name: string, description: string | null, members: string[], hostId: string) {
        try {
            if (members.length > 3) {
                throw new AppError(
                    ErrorMessages.MAXIMUM_MEMBERS_LIMIT,
                    StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST
                );
            }

            const bookClub = await this.repository.bookClub.create({
                data: {
                    name,
                    description,
                    hostId: hostId,
                }
            });

            // Adicionar os usuários ao clube como membros
            for (const userId of members) {
                await this.repository.clubMember.create({
                    data: {
                        userId,
                        clubId: bookClub.id
                    }
                });
            }

            return bookClub;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}
