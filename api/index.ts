import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'
import { router } from './routes'

const PORT = process.env.PORT ?? 3000

const app = express()
// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
)
// routes
app.use('/api', router)

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
