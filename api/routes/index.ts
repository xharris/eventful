import express from 'express'
import auth from './auth'

export const router = express.Router()

router.get('/', (req, res) => {
  res.send('API is running')
})

router.use(auth)
