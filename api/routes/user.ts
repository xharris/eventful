import { contact, user } from 'api/models'
import express from 'express'
import { Schema } from 'mongoose'
import { Eventful } from 'types'

export const router = express.Router()

router.get('/user/:userId', async (req, res) => {
  // query by userid and username
  let docUser: Eventful.User | null = null
  try {
    docUser = await user.findById(req.params.userId)
  } catch (e) {}
  if (!docUser) {
    docUser = await user.findOne({
      username: req.params.userId,
    })
  }
  if (!docUser) {
    return res.sendStatus(404)
  }
  return res.send(docUser)
})
