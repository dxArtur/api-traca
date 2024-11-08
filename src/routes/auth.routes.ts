import { AuthController } from "../modules/authentication/authenticateController"
import { Router, Request, Response, NextFunction } from "express"

const route = Router()
const authController = AuthController.getInstance()

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: User Sign In
 *     description: Authenticate user and return a token and user data
 *     tags:
 *       - Authenticate user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */

route.post('/signin', (req, res, next)=>authController.handle(req, res, next))

export default route