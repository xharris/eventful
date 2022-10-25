import { Request, Router } from 'express'

export const router = Router()

router.use((req, _, next) => {
  const send: Request['notification']['send'] = async (setting, data = {}) => {
    data.data = {
      ...data.data,
      title: data.general?.title ?? '',
      message: data.general?.subtitle ?? '',
      body: data.general?.body ? JSON.stringify(data.general?.body) : '',
    }
    if (data.general?.ui) {
      data.data = {
        ...data.data,
        experienceId: `@xhh950/ping`,
        scopeKey: '@xhh950/ping',
        categoryId: data.general.category ?? 'app',
      }
    }
    if (data.general?.id) {
      data.data.id = data.general.id
    }
    // data.notification =
    //   data.notification || data.general?.ui
    //     ? {
    //         title: data.general?.title,
    //         body: data.general?.body,
    //         ...data.notification,
    //       }
    //     : undefined
    data.webpush = {
      fcmOptions: {
        link: data.general?.url,
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
