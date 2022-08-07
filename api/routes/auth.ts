import express from 'express'
const router = express.Router()

router.post('/signup', (req, res) => {})

router.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send('INVALID_CREDS')
  }
})

export default router
