import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'
// importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js')
// importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js')

const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'eventful-870ba.firebaseapp.com',
  projectId: 'eventful-870ba',
  storageBucket: 'eventful-870ba.appspot.com',
  messagingSenderId: '79944665764',
  appId: '1:79944665764:web:cc722d5d8f9ca080bfb431',
})

const messaging = getMessaging(app)

onBackgroundMessage(messaging, (payload) => {
  console.log('Received background message ', payload)
  // Customize notification here
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})
