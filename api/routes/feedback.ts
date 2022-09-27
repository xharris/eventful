import { feedback } from 'api/models/feedback'
import express from 'express'
import { checkSession } from './auth'

export const router = express.Router()

router.post('/feedback', checkSession, async (req, res) => {
  const doc = await feedback.create({
    ...req.body,
    createdBy: req.session.user,
  })
  return res.send(doc)
})
