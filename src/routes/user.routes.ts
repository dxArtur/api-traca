import { Router, Request, Response, NextFunction } from 'express'
import { SignupController } from '../modules/users/signup/signupController'
import { GetUserController } from '../modules/users/getUser/getUserController'
import { ProfileController } from '../modules/users/profile/profileController'
import { errorHandle } from '../middlewares/errorHandle'
import { GetAllMyLikesController } from '../modules/likes/getAllMyLikes/getAllMyLikesController'
import { GetMyPublicationsController } from '../modules/post/getMy/getMyPublicationsController'
import { GetUserByIdController } from '../modules/users/getById/getByIdController'

const route = Router()
const signupController = SignupController.getInstance()




/**
 * @openapi
 * /signup:
 *   post:
 *     summary: User Signup
 *     description: Create a new user account
 *     tags:
 *       - Authenticate user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request
 */

route.post('/signup', (req: Request, res: Response, next: NextFunction) => signupController.handle(req, res, next))

/**
 * @openapi
 * /user/{username}:
 *   get:
 *     summary: Get User by Username
 *     description: Retrieve user details using username
 *     tags:
 *       - User management
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Username of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 */

route.get('/user/:username', (req:Request, res: Response, next:NextFunction)=>
    GetUserController.getInstance().handle(req, res, next))

route.get('/profile', (req:Request, res: Response, next:NextFunction)=>
    ProfileController.getInstance().handle(req, res, next))

route.get('/user/:userId/likes', (req:Request, res: Response, next:NextFunction)=>
    GetAllMyLikesController.getInstance().handle(req, res, next))

route.get('/userById/:userId', (req:Request, res: Response, next:NextFunction)=>
    GetUserByIdController.getInstance().handle(req, res, next))

export default route 