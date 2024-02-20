import bcrypt from 'bcrypt'


export class BcryptHelper{

    static async encrypt(plainPassword: string): Promise<string> {
        const hashedPassword = bcrypt.hashSync(plainPassword, Number(process.env.SALT))
        return hashedPassword
    }

    static async match(plainPassword: string, hashedPassword:string ) {
        const match = bcrypt.compareSync(plainPassword, hashedPassword)
        return match 
    }
}