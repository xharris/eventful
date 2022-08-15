import { initializeApp } from 'firebase/app'
import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging/sw'

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object

const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'eventful-870ba.firebaseapp.com',
  projectId: 'eventful-870ba',
  storageBucket: 'eventful-870ba.appspot.com',
  messagingSenderId: '79944665764',
  appId: '1:79944665764:web:cc722d5d8f9ca080bfb431',
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp)
