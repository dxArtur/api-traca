import { Request, Response, NextFunction } from "express"
import { QueryUseCase } from "./queryUseCase"
import STATUS_CODE from "../../custom/constants/StatusCode"


export class QueryController{
    private static instance: QueryController
    private QueryUseCase: QueryUseCase

    constructor(QueryUseCase: QueryUseCase) {
        this.QueryUseCase= QueryUseCase
    }

    public static getInstance() {
        if ( !QueryController.instance ) {
            QueryController.instance = new QueryController(QueryUseCase.getInstance())
        }

        return QueryController.instance
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.params.query
            const response = await this.QueryUseCase.execute(query)
            return res.status(STATUS_CODE.STATUS_CODE_SUCESS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

}