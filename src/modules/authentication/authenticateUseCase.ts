import { RepositoryClient } from "../../database/prismaClient"
import { PrismaClient } from "@prisma/client"
import { BcryptHelper } from "../../utils/BcryptHelper"
import { JwtHelper } from "../../utils/JwtHelper"
import { SigninUserDto } from "../../dto/UserDto"
import { AppError } from '../../errors/AppErrors'
import { JwtPayload } from "./JwtPayload"
import ErrorMessages from "../../custom/constants/ErrorMessages"


export class AuthUseCase{
    private static instance: AuthUseCase
    private repository: PrismaClient

    constructor(repository: PrismaClient){
        this.repository = repository
    }

    public static getInstance(){
        if (!AuthUseCase.instance) {
            AuthUseCase.instance = new AuthUseCase(RepositoryClient.getInstance())
        }
        return AuthUseCase.instance
    }

    async execute(dataUser:SigninUserDto):Promise<string> {
        try {
            const userAttemphAuth = await this.repository.user.findFirstOrThrow({
                where:{
                    email: dataUser.email,
                }
            })
    
            if (!userAttemphAuth) {
                throw new AppError(ErrorMessages.BAD_AUTH, 400)
            }
    
            const matchKeys = await BcryptHelper.match(dataUser.password, userAttemphAuth.password)
            
            if (!matchKeys){
                throw new AppError(ErrorMessages.BAD_AUTH, 401)
            }
    
            const payload: JwtPayload = {name: userAttemphAuth.name, nick:userAttemphAuth.nick, email: userAttemphAuth.email, id: userAttemphAuth.id}
            const expiration: string = '1h'
            const token = JwtHelper.sign(payload, expiration)
            return token
            
        } catch (error) {
            throw error
        }
    }
}