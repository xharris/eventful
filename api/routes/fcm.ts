import { fcmToken } from 'api/models'
import express from 'express'

export const router = express.Router()

router.post('/fcm', async (req, res) => {
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
