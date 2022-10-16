import { contact } from 'api/models'
import express from 'express'
import { Types } from 'mongoose'
import { Eventful } from 'types'
import { checkSession } from './auth'

export const router = express.Router()

router.get('/contacts/:userId', checkSession, async (req, res) => {
  const docContacts = await contact.aggregate([
    {
      $match: {
        $or: [
          {
            createdBy: new Types.ObjectId(req.params.userId),
          },
          {
            user: new Types.ObjectId(req.params.userId),
          },
        ],
      },
    },
    {
      $set: {
        user: {
          $cond: [
            {
              $eq: ['$createdBy', new Types.ObjectId(req.params.userId)],
            },
            '$user',
            '$createdBy',
          ],
        },
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
      $unwind: {
        path: '$user',
      },
    },
    {
      $unwind: {
        path: '$user',
      },
    },
    {
      $replaceRoot: {
        newRoot: '$user',
      },
    },
  ])
  return res.send(docContacts)
})

router.post('/contact/add/:otherUserId', checkSession, async (req, res) => {
  if (req.params.otherUserId.toString() === req.session.user?._id.toString()) {
    return res.status(400).send('SAME_USER')
  }
  const docContact = await contact.findOneAndUpdate(
    {
      user: req.params.otherUserId,
      createdBy: req.session.user,
    },
    {},
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  )
  return res.send(docContact)
})

router.delete('/contact/:otherUserId', checkSession, async (req, res) => {
  const docContact = await contact.deleteOne({
    user: req.params.otherUserId,
    createdBy: req.session.user?._id,
  })
  return res.send(docContact)
})
