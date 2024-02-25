import jwt from 'jsonwebtoken'

export class JwtHelper{

    static async sign(payload, expiresIn): Promise<string>{
        const token = jwt.sign(
            {
                name: payload.name,
                email: payload.email,
                sub: payload.id
            }, 
            process.env.SECRET!,
            {
                expiresIn: expiresIn,
                algorithm: 'HS256'
            }
            )
            return token
    }

    static async verify(){

    }


}