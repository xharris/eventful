import { event, plan, location, message } from 'api/models'
import { PipelineStage, Types } from 'mongoose'
import { Eventful } from 'types'
import express from 'express'
import { checkSession } from './auth'
import { planAggr, planNotify } from './plan'

// new Types.ObjectId(req.session.user?._id)
export const eventAggr: (user?: Eventful.ID) => PipelineStage[] = (user) => [
  {
    $lookup: {
      from: 'plans',
      localField: '_id',
      foreignField: 'event',
      as: 'plans',
      pipeline: planAggr() as PipelineStage.Lookup['$lookup']['pipeline'],
    },
  },
  {
    $match: {
      $or: [
        {
          createdBy: new Types.ObjectId(user),
        },
        {
          'plans.who._id': new Types.ObjectId(user),
        },
      ],
    },
  },
  {
    $unwind: {
      path: '$plans',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $group: {
      _id: '$_id',
      event: {
        $first: '$$ROOT',
      },
      plans: {
        $addToSet: '$plans',
      },
      who: {
        $addToSet: '$plans.who._id',
      },
      start: {
        $min: '$plans.time.start',
      },
      end: {
        $max: '$plans.time.end',
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          '$event',
          {
            who: '$who',
            plans: '$plans',
            time: { start: '$start', end: '$end' },
          },
        ],
      },
    },
  },
  {
    $set: {
      who: {
        $reduce: {
          input: '$who',
          initialValue: [],
          in: {
            $concatArrays: ['$$value', '$$this'],
          },
        },
      },
    },
  },
  {
    $set: {
      who: {
        $setUnion: ['$who', ['$createdBy']],
      },
    },
  },
  {
    $lookup: {
      from: 'users',
      localField: 'who',
      foreignField: '_id',
      as: 'who',
    },
  },
  {
    $sort: {
      'time.start.date': 1,
    },
  },
]

export const options: Eventful.API.RouteOptions = {
  route: {
    create: async (req, res) => {
      const docEvent = await event.create({
        name: req.body.name ?? 'new event',
        createdBy: req.session.user?._id,
      })
      return res.send(docEvent)
    },
    getAll: async (req, res) => {
      /*
        Get events...
          - created by session user
          - where plan.event == eventId && plan.who.includes(session user)
          - where plan.event == eventId && plan.createdBy == session user
      */
      const docEvents: Eventful.API.EventGet[] = await event.aggregate(
        eventAggr(req.session.user?._id)
      )
      return res.send(docEvents)
    },
    get: async (req, res) => {
      const docEvents = await event.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(req.params.eventId),
          },
        },
        ...eventAggr(req.session.user?._id),
      ])
      if (!docEvents.length) {
        return res.sendStatus(404)
      }
      return res.send(docEvents[0])
    },
    update: async (req, res) => {
      const docEvent = await event.findByIdAndUpdate(
        req.params.eventId,
        {
          name: req.body.name,
        },
        {
          new: true,
        }
      )
      return res.send(docEvent)
    },
    delete: async (req, res) => {
      const docRes = await event.deleteOne({ _id: req.params.eventId })
      return res.send(docRes)
    },
  },
}

export const router = express.Router()

router.post<{ eventId: string }>('/event/:eventId/plans/add', checkSession, async (req, res) => {
  const docPlan = await plan.create({
    who: [],
    category: req.body.category ?? 0,
    time: req.body.time,
    what: req.body.what ?? '',
    location: req.body.location,
    createdBy: req.session.user,
    event: req.params.eventId,
  })
  planNotify(req, 'plan:add', docPlan._id, 'added')
  return res.send(docPlan)
})

router.post('/event/:eventId/messages/add', checkSession, async (req, res) => {
  const docMessage = await message.create({
    text: req.body.text,
    event: req.params.eventId,
    replyTo: req.body.replyTo,
    createdBy: req.session.user,
  })
  message
    .findById<Eventful.API.MessageGet>(docMessage._id)
    .populate({
      path: 'replyTo',
      populate: { path: 'createdBy' },
    })
    .populate('createdBy')
    .then(async (doc) => {
      if (doc) {
        req.io.to(`event/${docMessage.event}`).emit('message:add', doc)
        return Promise.resolve([doc, await event.findById(docMessage.event)] as [
          Eventful.API.MessageGet,
          Eventful.API.EventGet
        ])
      }
      return Promise.resolve([])
    })
    .then(([docMessage2, docEvent]) => {
      if (docMessage2 && docEvent) {
        req.notification.send(
          {
            refModel: 'events',
            ref: docMessage2.event,
            key: 'message:add',
          },
          {
            notification: {
              title: docEvent.name,
              body: `${docMessage2.createdBy.username}: ${docMessage2.text}`,
            },
            webpush: {
              fcmOptions: {
                link: `${req.get('host')}/e/${docMessage2.event}`,
              },
            },
          }
        )
      }
    })
  return res.send(docMessage)
})

router.get('/event/:eventId/messages', checkSession, async (req, res) => {
  const docMessages = await message
    .find({
      event: req.params.eventId,
    })
    .populate({
      path: 'replyTo',
      populate: { path: 'createdBy' },
    })
    .populate('createdBy')
    .sort({ createdAt: -1 })
  return res.send(docMessages)
})
