import { access, contact, inviteLink } from 'api/models'
import express from 'express'
import { checkSession } from './auth'
import moment from 'moment'
import { Types } from 'mongoose'

export const router = express.Router()

router.post('/invitelink/:refModel/:refId', checkSession, async (req, res) => {
  const exists = await inviteLink.findOne({
    ref: req.params.refId,
    refModel: req.params.refModel,
    $or: [
      {
        expiresAt: null,
      },
      {
        $gt: new Date(),
      },
    ],
  })
  if (exists) {
    return res.send(exists)
  }
  const doc = await inviteLink.create({
    ref: req.params.refId,
    refModel: req.params.refModel,
    expiresAt: req.body.expiresAt,
    createdBy: req.session.user?._id,
  })
  return res.send(doc)
})

router.get('/invitelink/:inviteLinkId', checkSession, async (req, res) => {
  let id
  try {
    id = new Types.ObjectId(req.params.inviteLinkId)
  } catch {
    return res.sendStatus(400)
  }
  const doc = await inviteLink.findById(id)
  if (!doc) {
    return res.sendStatus(404)
  }
  if (id === req.session.user?._id) {
    return res.send(doc)
  }
  if (doc.expiresAt && moment(doc.expiresAt).isSameOrBefore(new Date())) {
    // expired
    inviteLink.deleteOne({ _id: id })
    return res.status(400).send('EXPIRED')
  }
  if (doc.refModel === 'tags') {
    const docAccess = await access.findOneAndUpdate(
      {
        ref: doc.ref,
        refModel: doc.refModel,
        user: req.session.user?._id,
      },
      {
        canView: true,
      },
      {
        upsert: true,
        new: true,
      }
    )
    return res.send(doc)
  }
  if (doc.refModel === 'users') {
    const docContact = await contact.findOneAndUpdate(
      {
        user: doc.ref,
        createdBy: req.session.user?._id,
      },
      {},
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    )
    return res.send(doc)
  }
  return res.sendStatus(404)
})
