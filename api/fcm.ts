import { RequestHandler } from 'express'
import admin from 'firebase-admin'
import { fcmToken, notification, notificationSetting } from './models'

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID ?? 'empty',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  // databaseURL: "https://my-firebase-app.firebaseio.com"
})

const chunkArray = <T>(arr: T[], size: number) =>
  new Array(Math.ceil(arr.length / size))
    .fill(new Array())
    .map((_, i) => arr.slice(i * size, i * size + size))

const instance = admin.messaging()

export const messaging: RequestHandler = (req, res, next) => {
  req.fcm = {
    send: async (setting, data) => {
      // get all users subscribed to this notification type (notificationSettings)
      const docNotifSettings = await notificationSetting.find({
        $or: [
          setting,
          {
            key: setting.key,
            ref: null,
            refModel: null,
          },
          {
            key: null,
            ref: setting.ref,
            refModel: setting.refModel,
          },
        ],
      })
      const users = new Set(docNotifSettings.map((ns) => ns.createdBy))
      if (data?.general?.store) {
        users.forEach((user) =>
          notification.create({
            ...data.general,
            user,
            createdBy: req.session.user?._id,
          })
        )
      }
      // get all device tokens (fcmTokens)
      const docFcmTokens = await fcmToken.find({
        createdBy: { $in: users },
      })
      const tokenChunks = chunkArray(
        docFcmTokens.map((doc) => doc.token),
        500
      )
      // send message
      console.log(
        'FCM',
        `${setting.refModel}/${setting.key} (id=${setting.ref}, users=${users.size}, tokens=${docFcmTokens.length}, chunks=${tokenChunks.length})`
      )
      return Promise.all(
        tokenChunks.map((tokens) =>
          instance.sendMulticast({
            ...data,
            apns: {
              ...data?.apns,
              // do i need 'content-available': 1 ?
            },
            tokens,
          })
        )
      )
    },
    addToken: async (token, user) =>
      await fcmToken.create({
        token,
        createdBy: user,
      }),
  }
  next()
}
