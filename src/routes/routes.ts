import { Router } from 'express'
import userRoutes from './user.routes'
import authRoutes from './auth.routes'
import searchRoutes from './search.routes'
import publicationsRoutes from './publications.routes'
import likeRoutes from './like.routes'
import commentRoutes from './comment.routes'
import ratingRoutes from './rating.routes'
import bookClubRoute from './bookclub.routes'
import uploadRoutes from './upload.route'
import { errorHandle } from '../middlewares/errorHandle'

const routes: Router = Router()

routes.use('/', userRoutes, errorHandle)
routes.use('/', authRoutes, errorHandle)
routes.use('/', searchRoutes, errorHandle)
routes.use('/', publicationsRoutes, errorHandle)
routes.use('/', likeRoutes, errorHandle)
routes.use('/', commentRoutes, errorHandle)
routes.use('/', ratingRoutes, errorHandle)
routes.use('/', bookClubRoute, errorHandle)
routes.use('/', uploadRoutes, errorHandle)

export default routes