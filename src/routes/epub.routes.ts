import { Router, Request, Response, NextFunction } from 'express'
import { OpenEpubController } from '../modules/epub/open/openEpubController'

const route = Router()
const openEpubController = OpenEpubController.getInstance()


route.get('/open',  (req: Request, res: Response, next: NextFunction) => openEpubController.handle(req, res, next))

export default route