import { Request, Router } from 'express'
import { notificationSetting } from './models'

export const router = Router()

router.use((req, _, next) => {
  const send: Request['notification']['send'] = async (setting, data) => {
    data.data = {
      ...data.data,
      ...(req.session.user ? { createdBy: req.session.user._id.toString() } : {}),
    }
    await req.fcm.send(setting, data)
    const { ref, key, refModel } = setting
    req.io.to(`${refModel}:${key}/${ref}`).emit('notification', data)
  }

  req.notification = { send }
  next()
})
