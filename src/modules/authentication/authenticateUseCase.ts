import { RepositoryClient } from "../../database/prismaClient"
import { PrismaClient } from "@prisma/client"
import { BcryptHelper } from "../../utils/BcryptHelper"
import { JwtHelper } from "../../utils/JwtHelper"
import { sanitizedUserInfo, SigninUserDto, UserDto } from "../../dto/UserDto"
import { AppError } from '../../errors/AppErrors'
import { JwtPayload } from "./JwtPayload"
import ErrorMessages from "../../custom/constants/ErrorMessages"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import StatusCode from "../../custom/constants/StatusCode"


export class AuthUseCase {
    private static instance: AuthUseCase
    private repository: PrismaClient

    constructor(repository: PrismaClient) {
        this.repository = repository
    }

    public static getInstance() {
        if (!AuthUseCase.instance) {
            AuthUseCase.instance = new AuthUseCase(RepositoryClient.getInstance())
        }
        return AuthUseCase.instance
    }

    async execute(dataUser: SigninUserDto): Promise<{ token: string; userData: sanitizedUserInfo }> {
        try {
            const userAttemphAuth = await this.repository.user.findFirstOrThrow({
                where: {
                    email: dataUser.email,
                }
            })


            const matchKeys = await BcryptHelper.match(dataUser.password, userAttemphAuth.password)

            if (!matchKeys) {
                throw new AppError(ErrorMessages.BAD_AUTH, StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST)
            }

            const userData: sanitizedUserInfo = {
                id: userAttemphAuth.id,
                email: userAttemphAuth.email,
                name: userAttemphAuth.name,
                nick: userAttemphAuth.nick
            }

            const payload: JwtPayload = userData
            const expiration: string = '1h'
            const token = await JwtHelper.sign(payload, expiration)
            return { token, userData }

        } catch (error) {
            console.error('Erro durante a autenticação:', error);


            if (error instanceof PrismaClientKnownRequestError) {
                throw new AppError(ErrorMessages.USER_NOT_FOUND, StatusCode.STATUS_CODE_CLIENT.NOT_FOUND);
            }

            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
        }
    }
}