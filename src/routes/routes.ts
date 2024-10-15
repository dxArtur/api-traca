import { Router } from 'express'
import userRoutes from './user.routes'
import authRoutes from './auth.routes'
import searchRoutes from './search.routes'
import publicationsRoutes from './publications.routes'
import { errorHandle } from '../middlewares/errorHandle'

const routes: Router = Router()

routes.use('/', userRoutes, errorHandle)
routes.use('/', authRoutes, errorHandle)
routes.use('/', searchRoutes, errorHandle)
routes.use('/', publicationsRoutes, errorHandle)

export default routes