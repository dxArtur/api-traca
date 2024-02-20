import { PrismaClient } from "@prisma/client"

export class RepositoryClient{
    private static instance: PrismaClient
    
    private constructor(){}

    public static getInstance(){
        if (! RepositoryClient.instance) {
            RepositoryClient.instance = new PrismaClient()
        }
        return RepositoryClient.instance
    }
}
