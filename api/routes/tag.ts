import { tag } from 'api/models'
import { filterKeys } from 'api/util'
import express from 'express'
import { PipelineStage, Types } from 'mongoose'
import { Eventful } from 'types'
import { checkSession } from './auth'
import { eventAggr } from './event'
import { pingAggr } from './ping'

type TagAggr = (options: { user?: Eventful.ID }) => PipelineStage[]
export const tagAggr: TagAggr = ({ user }) => [
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
            $or: [
              {
                canView: true,
              },
            ],
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
  {
    $lookup: {
      from: 'users',
      foreignField: '_id',
      localField: 'createdBy',
      as: 'createdBy',
    },
  },
  {
    $unwind: {
      path: '$createdBy',
    },
  },
  {
    $lookup: {
      from: 'accesses',
      localField: '_id',
      foreignField: 'ref',
      as: 'users',
      pipeline: [
        {
          $match: {
            canView: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $replaceRoot: {
            newRoot: '$user',
          },
        },
      ],
    },
  },
  {
    $set: {
      users: {
        $setUnion: ['$users', ['$createdBy']],
      },
    },
  },
  {
    $lookup: {
      from: 'events',
      localField: '_id',
      foreignField: 'tags',
      as: 'events',
      pipeline: eventAggr(user) as PipelineStage.Lookup['$lookup']['pipeline'],
    },
  },
  {
    $lookup: {
      from: 'pings',
      localField: '_id',
      foreignField: 'tags',
      as: 'pings',
      pipeline: pingAggr(user) as PipelineStage.Lookup['$lookup']['pipeline'],
    },
  },
  {
    $match: {
      'users._id': new Types.ObjectId(user),
    },
  },
]

export const router = express.Router()

router.post('/tag/create', checkSession, async (req, res) => {
  const doc = await tag.create({
    ...req.body,
    createdBy: req.session.user,
  })
  return res.send(doc)
})

router.get('/tag/:tagId', checkSession, async (req, res) => {
  const doc = (
    await tag.aggregate([
      ...tagAggr({ user: req.session.user?._id }),
      {
        $match: {
          _id: new Types.ObjectId(req.params.tagId),
        },
      },
    ])
  )[0]
  if (!doc) {
    return res.sendStatus(404)
  }
  return res.send(doc)
})

router.put('/tag/:tagId', checkSession, async (req, res) => {
  const doc = await tag.updateOne(
    { _id: req.params.tagId, createdBy: req.session.user },
    filterKeys<Eventful.API.TagEdit>(req.body, ['color', 'name'], true)
  )
  if (!doc.matchedCount) {
    return res.sendStatus(404)
  }
  return res.send(doc)
})

router.delete('/tag/:tagId', checkSession, async (req, res) => {
  const doc = await tag.deleteOne({ _id: req.params.tagId, createdBy: req.session.user })
  if (!doc.deletedCount) {
    return res.sendStatus(404)
  }
  return res.send(doc)
})

/** get all tags a user created / has access to */
router.get('/user/:userId/tags', checkSession, async (req, res) => {
  const docs = await tag.aggregate(tagAggr({ user: req.session.user?._id }))
  return res.send(docs)
})

/** list of users that have access to a tag */
router.get('/tag/:tagId/users', checkSession, async (req, res) => {})
