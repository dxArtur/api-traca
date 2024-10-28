import { CommentPublicationController } from "../modules/comment/commentInPublication/commentPublicationController"
import { ReplyCommentController } from "../modules/comment/replyComment/replyCommentController"
import { GetRepliesInCommentController } from "../modules/comment/getRepliesInComment/getRepliesInCommentController"
import { GetAllCommentsInPublicationController } from "../modules/comment/getAllCommentsInPublication/getAllCommentsInPublicationController"
import { Router, Request, Response, NextFunction } from "express"

const route = Router()
const commentPublicationController = CommentPublicationController.getInstance()
const replyCommentController = ReplyCommentController.getInstance()
const getAllCommentsInPublicationController = GetAllCommentsInPublicationController.getInstance()
const getRepliesInCommentController = GetRepliesInCommentController.getInstance()


/**
 * @openapi
 * /comment/{parentId}:
 *   post:
 *     summary: Add Comment to Publication
 *     description: Add a new comment to a publication
 *     tags:
 *       - Comments
 *     parameters:
 *       - name: parentId
 *         in: path
 *         required: true
 *         description: ID of the parent publication
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid request
 */
route.post('/comment/:parentId', (req, res, next)=>commentPublicationController.handle(req, res, next))
route.get('/comments/:publicationId', (req, res, next)=>getAllCommentsInPublicationController.handle(req, res, next))

//responnder comentário
route.post('/reply/:publicationId/:parentId', (req, res, next)=>replyCommentController.handle(req, res, next))
route.get('/reply/:parentId', (req, res, next)=>getRepliesInCommentController.handle(req, res, next))
//route.get('/post', (req, res, next)=>getAllPostController.handle(req, res, next))

export default route