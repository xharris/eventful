import { access, event } from 'api/models'
import { filterKeys } from 'api/util'
import express from 'express'
import { PipelineStage, Types } from 'mongoose'
import { Eventful } from 'types'
import { checkSession } from './auth'

const accessTypeAggr = (model: string): PipelineStage.FacetPipelineStage[] => [
  {
    $match: {
      refModel: `${model}s`,
    },
  },
  {
    $lookup: {
      from: `${model}s`,
      localField: 'ref',
      foreignField: '_id',
      as: `${model}`,
    },
  },
  {
    $unwind: `$${model}`,
  },
  {
    $lookup: {
      from: 'users',
      localField: `${model}.createdBy`,
      foreignField: '_id',
      as: `${model}.createdBy`,
    },
  },
  {
    $unwind: `$${model}.createdBy`,
  },
]

type AccessAggr = (user?: Eventful.ID) => PipelineStage[]
export const accessAggr: AccessAggr = (user) => [
  {
    $match: {
      user: new Types.ObjectId(user),
    },
  },
  {
    $facet: {
      tags: accessTypeAggr('tag'),
      events: accessTypeAggr('event'),
    },
  },
]

export const router = express.Router()

router.get('/access/:userId', checkSession, async (req, res) => {
  const docs = await access.aggregate(accessAggr(req.params.userId))
  return res.send(docs[0])
})

router.put('/access/:refModel/:refId/:userId', checkSession, async (req, res) => {
  if (req.body.isRemoved) {
    req.body.isInvited = false
  } else if (req.body.isInvited) {
    req.body.isRemoved = false
  }
  const doc = await access.findOneAndUpdate(
    { user: req.params.userId, ref: req.params.refId, refModel: req.params.refModel },
    filterKeys(req.body, ['_id', 'createdAt', 'createdBy', 'ref', 'refModel', 'user']),
    { upsert: true, new: true }
  )
  const transform = { tags: 'tag', events: 'event', users: 'user', plans: 'plan' }
  if (doc.refModel && doc.refModel in transform) {
    new Promise(async () => {
      if (doc.refModel) {
        req.io.to(`${transform[doc.refModel]}/${doc._id}`).emit('access:change', doc)
      }
      // notify: invited to event
      if (doc.refModel === 'events' && req.body.isInvited) {
        const docEvent = await event.findById(doc.ref)
        req.notification.send(
          {
            key: 'access:change',
            ref: doc._id,
            refModel: req.params.refModel as Eventful.NotificationSetting['refModel'],
          },
          {
            general: {
              title: 'You have been invited',
              body: docEvent?.name,
              ui: true,
              store: true,
            },
          }
        )
      }
    })
  }
  return res.send(doc)
})
