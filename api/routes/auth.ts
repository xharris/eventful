import express, { RequestHandler } from 'express'
import { user } from '../models'
import bcrypt from 'bcrypt'

// 3 months
const REMEMBER_TIME = 1000 * 60 * 60 * 24 * 90

const router = express.Router()

export const checkSession: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    res.status(401).send('UNAUTHORIZED')
  } else {
    next()
  }
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
  req.session.user = docUser
  if (req.body.remember) {
    req.session.cookie.expires = new Date(Date.now() + REMEMBER_TIME)
    req.session.cookie.maxAge = REMEMBER_TIME
  }
  return res.status(200).send(docUser)
})

router.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send('INVALID_CREDS')
  }
  const docUser = await user.findOne({ username: req.body.username })
  if (!docUser) {
    return res.sendStatus(404)
  }
  if (!(await bcrypt.compare(req.body.password, docUser.password))) {
    return res.sendStatus(401)
  }
  req.session.user = docUser
  if (req.body.remember) {
    req.session.cookie.expires = new Date(Date.now() + REMEMBER_TIME)
    req.session.cookie.maxAge = REMEMBER_TIME
  }
  return res.status(200).send(docUser)
})

router.get('/logout', (req, res) => {
  req.session.destroy(() => console.log('User logged out'))
  res.sendStatus(200)
})

router.get('/auth', checkSession, (req, res) => res.send(req.session.user))

export default router
