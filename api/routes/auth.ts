import express, { Request, RequestHandler, Response } from 'express'
import { user } from '../models'
import bcrypt from 'bcrypt'
import { Eventful } from 'types'
import session from 'express-session'
import ConnectMongo from 'connect-mongodb-session'
import { DATABASE_URI, IS_PRODUCTION } from 'api/config'

const MongoDBStore = ConnectMongo(session)

const store = new MongoDBStore({
  uri: DATABASE_URI,
  collection: 'sessions',
})
// 3 months
const REMEMBER_TIME = 1000 * 60 * 60 * 24 * 90
const EXPIRE_TIME = 0

const router = express.Router()

router.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    // cookie: {
    //   secure: IS_PRODUCTION,
    //   sameSite: 'none',
    // },
    store,
    resave: false,
    saveUninitialized: false,
  })
)
store.on('error', console.log)

export const checkSession: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    res.status(401).send('UNAUTHORIZED')
  } else {
    next()
  }
}

const newSession = (req: Request, user: Eventful.User, remember?: boolean) => {
  req.session.user = user
  if (remember) {
    req.session.cookie.expires = new Date(Date.now() + REMEMBER_TIME)
    req.session.cookie.maxAge = REMEMBER_TIME
  }
}

const destroySession = (req: Request) => {
  req.session.destroy(console.log)
}

router.post('/signup', async (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.confirm_password) {
    return res.status(400).send('INVALID_INPUT')
  }
  if (req.body.password !== req.body.confirm_password) {
    return res.status(400).send('PASSWORD_MISMATCH')
  }
  const docExisting = await user.exists({ username: req.body.username })
  if (docExisting) {
    return res.status(400).send('EXISTS')
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const docUser = await user.create({
    username: req.body.username,
    password: hashedPassword,
  })
  newSession(req, docUser, req.body.remember)
  return res.status(200).send(docUser)
})

router.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send('INVALID_CREDS')
  }
  const docUser = await user.findOne({ username: req.body.username })
  if (!docUser) {
    return res.status(404).send('USER_NOT_FOUND')
  }
  if (!(await bcrypt.compare(req.body.password, docUser.password))) {
    return res.status(401).send('INVALID_CREDS')
  }
  newSession(req, docUser, req.body.remember)
  return res.status(200).send(docUser)
})

router.get('/logout', (req, res) => {
  destroySession(req)
  res.sendStatus(200)
})

router.get('/auth', checkSession, (req, res) => res.send(req.session.user))

export default router
