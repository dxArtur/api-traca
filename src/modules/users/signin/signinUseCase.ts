import { PrismaClient } from "@prisma/client"
import { RepositoryClient } from "../../../database/prismaClient"
import { SigninUserDto, UserDto, UserSanitized } from "../../../dto/UserDto"
import ErrorMessages from "../../../custom/constants/ErrorMessages"
import { BcryptHelper } from "../../../utils/BcryptHelper"
import { JwtHelper } from "../../../utils/JwtHelper"



export class SigninUseCase{
    private static instance: SigninUseCase
    private repository: PrismaClient

    constructor(repository: PrismaClient) {
        this.repository = repository
    }

    public static getInstance() {
        if (!SigninUseCase.instance) {
            SigninUseCase.instance = new SigninUseCase(RepositoryClient.getInstance())
        }
        return SigninUseCase.instance
    }

    async execute({email, password}: SigninUserDto) {
        try {
            const userAttemphAuth = await this.repository.user.findFirstOrThrow({
                where: {
                    email: email,
                }            
            })
            if (!userAttemphAuth) {
                throw new Error(ErrorMessages.USER_NOT_FOUND)
            }

            const matchKeys = await BcryptHelper.match(password, userAttemphAuth.password)

            if (!matchKeys) {
                throw new Error(ErrorMessages.BAD_AUTH)
            }

            const token = await JwtHelper.sign(userAttemphAuth,  '1h')


            return {token, userAttemphAuth /* , userData: {id: userAttemphAuth.id, name:userAttemphAuth.name, nick:userAttemphAuth.nick, email:userAttemphAuth.email, password:userAttemphAuth.password} */ }
        } catch (error) {
            throw error 
        } 
    }
}