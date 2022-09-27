import { contact, reminder, user, userSetting } from 'api/models'
import { cleanUser } from 'api/util'
import express, { Request, RequestHandler, Response } from 'express'
import { Schema, Types } from 'mongoose'
import { Eventful } from 'types'
import { checkSession } from './auth'

export const router = express.Router()

const isMe: RequestHandler = (req, res, next) => {
  if (req.params.userId !== req.session.user?._id.toString()) {
    return res.sendStatus(401)
  }
  return next()
}

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
  cleanUser(docUser)
  return res.send(docUser)
})

router.get('/user/:userId/settings', checkSession, isMe, async (req, res) => {
  const docSettings = await userSetting.find({
    createdBy: new Types.ObjectId(req.params.userId),
  })
  const settings: Record<string, string> = {}
  docSettings.map((doc) => {
    settings[doc.key] = doc.value
  })
  return res.send(settings)
})

router.put('/user/:userId/settings', checkSession, isMe, async (req, res) => {
  for (const [key, value] of Object.entries(req.body as Eventful.API.SettingsEdit)) {
    await userSetting.updateOne({ key, createdBy: req.params.userId }, { value }, { upsert: true })
  }
  return res.sendStatus(200)
})

router.get('/user/:userId/reminders', checkSession, isMe, async (req, res) => {
  const docs = await reminder.find({ createdBy: req.params.userId })
  const unitOrder = ['m', 'h', 'd', 'w', 'M']
  return res.send(
    docs.sort((a, b) => {
      if (a.unit === b.unit) {
        return b.amount - a.amount
      }
      return unitOrder.findIndex((u) => u === b.unit) - unitOrder.findIndex((u) => u === a.unit)
    })
  )
})

// create
router.post('/user/:userId/reminders', checkSession, isMe, async (req, res) => {
  const doc = await reminder.create({ createdBy: req.params.userId })
  return res.send(doc)
})

// update
router.put('/user/:userId/reminders/:reminderId', checkSession, isMe, async (req, res) => {
  const doc = await reminder.updateOne(
    { createdBy: req.params.userId, _id: req.params.reminderId },
    req.body
  )
  if (!doc.modifiedCount) {
    return res.sendStatus(404)
  }
  return res.send(doc)
})

// delete
router.delete('/user/:userId/reminders/:reminderId', checkSession, isMe, async (req, res) => {
  const doc = await reminder.deleteOne({ createdBy: req.params.userId, _id: req.params.reminderId })
  if (!doc.deletedCount) {
    return res.sendStatus(404)
  }
  return res.send(doc)
})

router.get('/users/search/:username', checkSession, async (req, res) => {
  const docUsers = await user.aggregate([
    {
      $match: {
        username: {
          $regex: req.params.username,
          $options: 'i',
        },
      },
    },
    {
      $project: {
        password: 0,
      },
    },
    {
      $lookup: {
        from: 'usersettings',
        localField: '_id',
        foreignField: 'createdBy',
        as: 'userSetting',
        let: {
          user: '$_id',
        },
        pipeline: [
          {
            $match: {
              key: 'searchVisibility',
              $expr: {
                $eq: ['$createdBy', '$$user'],
              },
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$userSetting',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'contacts',
        localField: '_id',
        foreignField: 'createdBy',
        as: 'otherContact',
        pipeline: [
          {
            $match: {
              user: req.session.user?._id,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$otherContact',
        preserveNullAndEmptyArrays: true,
      },
    },
  ])

  return res.send(
    docUsers
      .filter(
        (doc) =>
          !doc.userSetting ||
          doc.userSetting.value === 'any' ||
          (doc.userSetting.value === 'contacts' && doc.otherContact)
      )
      .map((doc) => {
        delete doc.userSetting
        delete doc.otherContact
        return doc
      })
  )
})
