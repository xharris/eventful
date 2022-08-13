import admin from 'firebase-admin'
import { fcmToken, notificationSetting } from './models'

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
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
export const messaging: Express.Request['fcm'] = {
  messaging: instance,
  send: async (setting, data) => {
    // get all users subscribed to this notification type (notificationSettings)
    const docNotifSettings = await notificationSetting.find(setting)
    const users = docNotifSettings.map((ns) => ns.createdBy)
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
      `${setting.refModel}/${setting.key} (id=${setting.ref}, users=${users.length}, tokens=${docFcmTokens.length}, chunks=${tokenChunks.length})`
    )
    return Promise.all(
      tokenChunks.map((tokens) =>
        instance.sendMulticast({
          ...data,
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
