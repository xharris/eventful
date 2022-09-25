import { Request, Router } from 'express'
import { notificationSetting } from './models'

export const router = Router()

router.use((req, _, next) => {
  const send: Request['notification']['send'] = async (setting, data) => {
    data.data = {
      ...data.data,
      ...(req.session.user ? { createdBy: req.session.user._id.toString() } : {}),
    }
    data.notification = {
      title: data.general.title,
      body: data.general.body,
      ...data.notification,
    }
    data.webpush = {
      fcmOptions: {
        link: data.general.url,
        ...data.webpush?.fcmOptions,
      },
      ...data.webpush,
    }
    await req.fcm.send(setting, data)
    const { ref, key, refModel } = setting
    req.io.to(`${refModel}:${key}/${ref}`).emit('notification', data)
  }

  req.notification = { send }
  next()
})
