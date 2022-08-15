self.onerror = (e) => console.error(e)

self.addEventListener('fetch', () => {
  const urlParams = new URLSearchParams(location.search)
  self.firebaseConfig = Object.fromEntries(urlParams)

  importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js')
  importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js')

  firebase.initializeApp({
    appId: '1:79944665764:web:cc722d5d8f9ca080bfb431',
    projectId: 'eventful-870ba',
    authDomain: 'eventful-870ba.firebaseapp.com',
    storageBucket: 'eventful-870ba.appspot.com',
    messagingSenderId: '79944665764',
    ...self.firebaseConfig,
  })

  const messaging = firebase.messaging()

  messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload)
    // Customize notification here
    const notificationTitle = payload.notification.title
    const notificationOptions = {
      body: payload.notification.body,
    }
    self.registration.showNotification(notificationTitle, notificationOptions)
  })
})

// import { initializeApp } from 'firebase/app'
// import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

// const app = initializeApp({
//   appId: '1:79944665764:web:cc722d5d8f9ca080bfb431',
//   projectId: 'eventful-870ba',
//   authDomain: 'eventful-870ba.firebaseapp.com',
//   storageBucket: 'eventful-870ba.appspot.com',
//   messagingSenderId: '79944665764',
//   ...self.firebaseConfig,
// })

// const messaging = getMessaging(app)

// onBackgroundMessage(messaging, (payload) => {
//   console.log('Received background message ', payload)
//   // Customize notification here
//   const notificationTitle = payload.notification.title
//   const notificationOptions = {
//     body: payload.notification.body,
//   }
//   self.registration.showNotification(notificationTitle, notificationOptions)
// })
