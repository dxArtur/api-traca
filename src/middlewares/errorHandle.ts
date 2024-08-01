import { AppError } from "../errors/AppErrors"
import { Request, Response, NextFunction } from "express"

export function errorHandle(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
)
{
    
    

    if (error instanceof AppError) {
        res.status(error.statusCode).json({message: error.message})
    }

    else {
        console.log(error)
        return res.status(500).json({
            status: "Error",
            message: "Error server internal"

        })
    }

}