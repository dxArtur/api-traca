import { Request, Response, NextFunction } from "express"
import { JwtHelper } from "../utils/JwtHelper"

interface IPayload{
    sub:string;
    iat:number;
    exp: number;
  }

export function verifyTokenAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const header = req.headers.authorization

    if (!header) {
        return res.status(401).json({message: 'token missing'})
    }

    const token = header.split(' ')[1]

    try {
        
        const sub = JwtHelper.verify(token)

        

        return next()
    } catch (error) {
        return res.status(401).json({message: 'token is invalid'})
    }
}