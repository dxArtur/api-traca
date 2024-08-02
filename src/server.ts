import express from "express"
import dotenv from 'dotenv'
import routes from "./routes/routes"
import cors from 'cors'

const app = express()

app.use(cors())

app.use(express.json())
app.use('/api', routes)

export default app