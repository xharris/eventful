import { contact, user, userSetting } from 'api/models'
import express from 'express'
import { Schema, Types } from 'mongoose'
import { Eventful } from 'types'
import { checkSession } from './auth'

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

router.get('/user/:userId/settings', checkSession, async (req, res) => {
  if (req.params.userId !== req.session.user?._id.toString()) {
    return res.sendStatus(401)
  }
  const docSettings = await userSetting.find({
    createdBy: new Types.ObjectId(req.params.userId),
  })
  const settings: Record<string, string> = {}
  docSettings.map((doc) => {
    settings[doc.key] = doc.value
  })
  return res.send(settings)
})

router.put('/user/:userId/settings', checkSession, async (req, res) => {
  if (req.params.userId !== req.session.user?._id.toString()) {
    return res.sendStatus(401)
  }
  for (const [key, value] of Object.entries(req.body as Eventful.API.SettingsEdit)) {
    await userSetting.updateOne({ key, createdBy: req.params.userId }, { value }, { upsert: true })
  }
  return res.sendStatus(200)
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
