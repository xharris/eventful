import { ping } from 'api/models'
import express from 'express'
import { Eventful } from 'types'
import { checkSession } from './auth'

export const router = express.Router()

router.post('/ping', checkSession, async (req, res) => {
  const docPing = await ping.create({
    ...req.body,
    createdBy: req.session.user?._id,
  })
  return res.send(docPing)
})

router.get('/pings', checkSession, async (req, res) => {
  const docPings: Eventful.API.PingGet[] = await ping.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy',
      },
    },
  ])
  return res.send(docPings)
})
