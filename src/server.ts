import express from "express"
import dotenv from 'dotenv'
import routes from "./routes/routes"
import cors from 'cors'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import swaggerDocs from "./config/swagger"
import SwaggerUiOptions from "swagger-ui-express"
//import swagger from "./config/swagger.json"

const app = express()



app.use(cors())

app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET!,
  name: 'sessionId',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}))

app.use(express.json())
app.use('/api', routes)

app.use('/api-docs', SwaggerUiOptions.serve, SwaggerUiOptions.setup(swaggerDocs))

export default app