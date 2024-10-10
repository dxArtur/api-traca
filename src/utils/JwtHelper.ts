import jwt, { verify } from 'jsonwebtoken'
import { JwtPayload } from '../modules/authentication/JwtPayload'
import { Request, Response, NextFunction } from "express"

interface IPayload{
    sub:string;
    iat:number;
    exp: number;
  }

export class JwtHelper{

    static async sign(payload:JwtPayload, expiresIn:string): Promise<string>{

        const token = jwt.sign(
            {
                sub: payload.id,
                name: payload.name,
                email: payload.email,
                nick: payload.nick,
            }, 
            process.env.SECRET!,
            {
                expiresIn: expiresIn,
                algorithm: 'HS256'
            }
            )
            return token
    }

    static async verify(token: string): Promise<string|null>{
        const { sub } = verify(token, process.env.SECRET!) as IPayload
        return sub || null
        
    }


}