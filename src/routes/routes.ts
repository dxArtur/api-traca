import { Router } from 'express'
import userRoutes from './user.routes'
import authRoutes from './auth.routes'
import searchRoutes from './search.routes'
import { errorHandle } from '../middlewares/errorHandle'

const routes: Router = Router()

routes.use('/', userRoutes, errorHandle)
routes.use('/', authRoutes, errorHandle)
routes.use('/', searchRoutes, errorHandle)

export default routes