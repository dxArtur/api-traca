import { RepositoryClient } from "../../database/prismaClient"
import { PrismaClient } from "@prisma/client"
import { BcryptHelper } from "../../utils/BcryptHelper"
import { JwtHelper } from "../../utils/JwtHelper"

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

    async execute({email, password}) {
        const userAttemphAuth = await this.repository.user.findFirstOrThrow({
            where:{
                email: email,
            }
        })

        if (!userAttemphAuth) {
            throw new Error('User not found')
        }

        const matchKeys = await BcryptHelper.match(password, userAttemphAuth.password)
        
        if (!matchKeys){
            throw new Error('bad auth')
        }

        const payload = {name: userAttemphAuth.name, email: userAttemphAuth.email, id: userAttemphAuth.id}
        const expiration= '1h'
        const token = JwtHelper.sign(payload, expiration)
        return token
    }
}