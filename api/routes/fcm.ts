import { fcmToken } from 'api/models'
import express from 'express'
import { checkSession } from './auth'

export const router = express.Router()

router.post('/fcm', checkSession, async (req, res) => {
  const docFcmToken = await fcmToken.updateOne(
    {
      token: req.body.token,
      createdBy: req.session.user?._id,
    },
    {},
    { upsert: true, new: true }
  )
  return res.send(docFcmToken)
})

router.delete('/fcm', checkSession, async (req, res) => {
  const doc = await fcmToken.deleteMany({
    createdBy: req.session.user?._id,
  })
  return res.send(doc)
})
