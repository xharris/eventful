import { contact, tag } from 'api/models'
import { ping } from 'api/models/ping'
import express from 'express'
import { PipelineStage, Types } from 'mongoose'
import { Eventful } from 'types'
import { checkSession } from './auth'
import { tagAggr } from './tag'

export const router = express.Router()

type PingAggr = (user?: Eventful.ID) => PipelineStage[]
export const pingAggr: PingAggr = (user) => [
  {
    $lookup: {
      from: 'contacts',
      as: 'isFriend',
      pipeline: [
        {
          $match: {
            $or: [
              {
                createdBy: new Types.ObjectId(user),
              },
              {
                user: new Types.ObjectId(user),
              },
            ],
          },
        },
      ],
    },
  },
  {
    $set: {
      isFriend: {
        $gt: [
          {
            $size: '$isFriend',
          },
          0,
        ],
      },
    },
  },
  {
    $lookup: {
      from: 'tags',
      localField: 'tags',
      foreignField: '_id',
      as: 'tags',
      pipeline: [
        {
          $lookup: {
            from: 'accesses',
            localField: '_id',
            foreignField: 'ref',
            as: 'access',
            pipeline: [
              {
                $match: {
                  user: new Types.ObjectId(user),
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$access',
            preserveNullAndEmptyArrays: true,
          },
        },
      ],
    },
  },
  {
    $match: {
      $or: [
        {
          'tags.access.canView': true,
        },
        {
          'tags.createdBy': new Types.ObjectId(user),
        },
        {
          createdBy: new Types.ObjectId(user),
        },
        {
          isFriend: true,
          $or: [{ 'tags.access.canView': true }, { tags: { $size: 0 } }],
          scope: { $ne: 'me' },
        },
      ],
    },
  },

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
    $sort: {
      createdAt: -1,
    },
  },
]

const PING_SCOPE = {
  me: 'just me',
  public: 'global',
  contacts: 'friends',
}

router.get('/pings', checkSession, async (req, res) => {
  const docs = await ping.aggregate(pingAggr(req.session.user?._id))
  return res.send(docs)
})

router.post('/pings', checkSession, async (req, res) => {
  const doc = await ping.create({
    ...req.body,
    createdBy: req.session.user?._id,
  })
  let users: Eventful.ID[] = []
  // get tags
  users.concat(
    (
      await tag.aggregate([
        ...tagAggr({
          user: req.session.user?._id,
        }),
        {
          $match: {
            _id: {
              $in: doc.tags,
            },
          },
        },
      ])
    ).map((tag) => tag._id)
  )
  // get contacts
  if (doc.scope === 'contacts') {
    users.concat(
      (
        await contact.find({
          $or: [
            {
              createdBy: req.session.user?._id,
            },
            {
              user: req.session.user?._id,
            },
          ],
        })
      ).map((docContact) =>
        docContact.user === req.session.user?._id ? docContact.createdBy : docContact.user
      )
    )
  }
  req.notification.send(
    {
      refModel: 'pings',
      ref: doc._id,
      key: 'ping:add',
      users,
    },
    {
      general: {
        title: req.body.title,
        body: [doc.scope && doc.scope !== 'me' ? PING_SCOPE[doc.scope] : null]
          .filter((s) => !!s)
          .map((s) => `#${s}`)
          .join(' '),
        ui: true,
      },
    }
  )
  return res.send(doc)
})

router.delete('/pings/:pingId', checkSession, async (req, res) => {
  const doc = await ping.deleteOne({ _id: req.params.pingId, createdBy: req.session.user?._id })
  if (!doc.deletedCount) {
    return res.sendStatus(404)
  }
  return res.send(doc)
})
