import { PrismaClient } from "@prisma/client"
import { SigninUseCase } from "./signinUseCase"
import { RepositoryClient } from "../../../database/prismaClient"
import { SigninUserDto } from "../../../dto/UserDto"



export class SigninController {
    private static instance: SigninController
    private signinUseCase: SigninUseCase


    constructor(signinUseCase: PrismaClient) {
        this.signinUseCase = signinUseCase
    }

    public static getInstance() {
        if (! SigninController.instance) {
            SigninUseCase.instance = new SigninUseCase(RepositoryClient.getInstance())
        }

        return SigninController.instance
    }

    async execute(dataUser: SigninUserDto): Promise<SigninUserDto> {
        const userAttemphAuth = await this.repository.user.
        return { token,  userAttemphAuth }
    }
}