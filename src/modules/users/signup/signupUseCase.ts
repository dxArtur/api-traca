import { RepositoryClient } from "../../../database/prismaClient"
import { PrismaClient } from "@prisma/client"
import { BcryptHelper } from "../../../utils/BcryptHelper"


export class SignupUseCase{
    private static instance: SignupUseCase
    private repository: PrismaClient

    constructor(repository: PrismaClient){
        this.repository = repository
    }

    public static getInstance(){
        if (!SignupUseCase.instance) {
            SignupUseCase.instance = new SignupUseCase(RepositoryClient.getInstance())
        }

        return SignupUseCase.instance
    }

    async execute(dataUser:any):Promise<any>{
        try {
            const existUser = await this.repository.user.findFirst({
                where:{
                    email: dataUser.email
                }
            })
            if (existUser) {
                throw new Error('User Already exists')
            }

            const hashedPassword = await BcryptHelper.encrypt(dataUser.password)
            const newUser = await this.repository.user.create({
                data: {
                    email:dataUser.email,
                    name: dataUser.name,
                    password: hashedPassword,
                    saves: dataUser.saves,
                    books: dataUser.books
                }
            })
    
            return newUser
            
        } catch (error) {
            throw error 
        }
    }
}