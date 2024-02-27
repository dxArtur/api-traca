import { Router } from 'express'
import userRoutes from './user.routes'
import authRoutes from './auth.routes'
import { errorHandle } from '../middlewares/errorHandle'

const routes: Router = Router()

routes.use('/', userRoutes, errorHandle)
routes.use('/', authRoutes, errorHandle)

export default routes