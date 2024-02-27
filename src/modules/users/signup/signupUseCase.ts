import { RepositoryClient } from "../../../database/prismaClient"
import { UserDto, CreateUserDto } from "../../../dto/UserDto"
import { PrismaClient } from "@prisma/client"
import { BcryptHelper } from "../../../utils/BcryptHelper"
import { AppError } from "../../../errors/AppErrors"


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

    async execute(dataUser:CreateUserDto):Promise<UserDto>{
        try {
            const existUser = await this.repository.user.findFirst({
                where:{
                    email: dataUser.email
                }
            })
            if (existUser) {
                throw new AppError(ERROR_MESSAGES.USER_ALREADY_EXIST, STATUS_CODE_CLIENT.BAD_REQUEST)
            }

            const hashedPassword = await BcryptHelper.encrypt(dataUser.password)
            const newUser = await this.repository.user.create({
                data: {
                    email:dataUser.email,
                    name: dataUser.name,
                    nick: dataUser.nick,
                    password: hashedPassword,
                }
            })
    
            return newUser
            
        } catch (error) {
            throw error 
        }
    }
}