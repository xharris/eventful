import { ping } from 'api/models/ping'
import express from 'express'
import { PipelineStage } from 'mongoose'
import { Eventful } from 'types'
import { checkSession } from './auth'

export const router = express.Router()

type PingAggr = (user?: Eventful.ID) => PipelineStage[]
export const pingAggr: PingAggr = (user) => [
  {
    $lookup: {
      from: 'users',
      localField: 'createdBy',
      foreignField: '_id',
      as: 'createdBy',
    },
  },
  {
    $unwind: '$createdBy',
  },
  {
    $lookup: {
      from: 'tags',
      localField: 'tags',
      foreignField: '_id',
      as: 'tags',
    },
  },
  {
    $sort: {
      createdAt: -1,
    },
  },
]

router.get('/pings', checkSession, async (req, res) => {
  const docs = await ping.aggregate(pingAggr(req.session.user?._id))
  return res.send(docs)
})

router.post('/pings', checkSession, async (req, res) => {
  const doc = await ping.create({
    ...req.body,
    createdBy: req.session.user?._id,
  })
  return res.send(doc)
})

router.delete('/pings/:pingId', checkSession, async (req, res) => {
  const doc = await ping.deleteOne({ _id: req.params.pingId, createdBy: req.session.user?._id })
  if (!doc.deletedCount) {
    return res.sendStatus(404)
  }
  return res.send(doc)
})
