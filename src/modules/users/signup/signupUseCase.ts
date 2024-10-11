import { RepositoryClient } from "../../../database/prismaClient"
import { UserDto, CreateUserDto } from "../../../dto/UserDto"
import { PrismaClient } from "@prisma/client"
import { BcryptHelper } from "../../../utils/BcryptHelper"
import { AppError } from "../../../errors/AppErrors"
import StatusCode from "../../../custom/constants/StatusCode"
import ErrorMessages from "../../../custom/constants/ErrorMessages"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"


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
            if (error instanceof PrismaClientKnownRequestError) {
                // Trata o erro do usuário já cadastrado
                throw new AppError(ErrorMessages.USER_ALREADY_EXIST, StatusCode.STATUS_CODE_CLIENT.BAD_REQUEST);
            }
            throw new AppError(ErrorMessages.INTERNAL_ERROR_SERVER, StatusCode.STATUS_CODE_SERVER.INTERNAL_SERVER_ERROR);
        }
    }
}