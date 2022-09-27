// import firebase from '@react-native-firebase/app'
import { useEffect } from 'react'
import { Eventful } from 'types'
// import config from '../google-services.json'
import { api } from '../eventfulLib/api'
import { logger } from 'src/eventfulLib/log'

const log = logger.extend('lib/notification')

// if (!firebase.apps.length) {
//   firebase.initializeApp({
//     clientId: config.client[0].oauth_client[0].client_id,
//     appId: config.client[0].client_info.mobilesdk_app_id,
//     apiKey: config.client[0].api_key[0].current_key,
//     databaseURL: '',
//     storageBucket: '',
//     messagingSenderId: '',
//     projectId: config.project_info.project_id,
//   })
// }

// messaging().setBackgroundMessageHandler(async (msg) => {
//   console.log(msg)
// })

export const requestPermission = async () => {
  if (!('Notification' in window)) {
    return false
  }
  if (Notification.permission === 'granted') {
    return true
  }
  const perm = await Notification.requestPermission()
  if (perm === 'granted') {
    return true
  }
  return false
}
// messaging()
//   .requestPermission()
//   .then(
//     (status) =>
//       status === messaging.AuthorizationStatus.AUTHORIZED ||
//       status === messaging.AuthorizationStatus.PROVISIONAL
//   )

export const showLocalNotification = (payload: Eventful.NotificationPayload) =>
  new Notification(payload.notification?.title ?? '', {
    body: payload.notification?.body,
  })

export const cancelAllScheduledNotifications = async () => {
  // try {
  //   const reg = await navigator.serviceWorker.getRegistration()
  //   if (reg) {
  //     const notifications = await reg.getNotifications()
  //     notifications.forEach((notif) => notif.close())
  //     log.info(`${notifications.length} notifications cancelled`)
  //   }
  //   log.info('nothing cancelled')
  // } catch (e) {
  //   log.error(e)
  // }
}

export const scheduleNotification = async (notification: Eventful.LocalNotification) => {}

export const useMessaging = () => {
  // useEffect(() => {
  //   messaging()
  //     .getToken()
  //     .then((token) => {
  //       console.log('token', token)
  //       return api.post('fcm', { token })
  //     })
  //     .catch((err) => console.log(err))
  //   const unsub = messaging().onMessage((payload) => {
  //     console.log('foreground message', payload)
  //   })
  //   return () => {
  //     unsub()
  //   }
  // }, [])
}
