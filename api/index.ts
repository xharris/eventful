import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieSession from 'cookie-session'
import { router } from './routes'
import mongoose, { mongo } from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'

const PORT = process.env.PORT ?? 3000
const DATABASE_URI = `${process.env.DATABASE_URI}/${process.env.DATABASE_NAME}`

const app = express()
// middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
)
app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cookieSession({
    name: 'session',
    secret: process.env.SESSION_SECRET as string,
  })
)
// routes
app.use('/api', router)
app.use(express.static('public'))
// database
mongoose
  .connect(DATABASE_URI)
  .then(() => console.log(`Database connected to ${DATABASE_URI}`))
  .catch(console.error)
// server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
