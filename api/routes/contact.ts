import { contact } from 'api/models'
import express from 'express'
import { checkSession } from './auth'

export const router = express.Router()

router.get('/contacts', checkSession, async (req, res) => {
  const docContacts = await contact
    .find({
      createdBy: req.session.user?._id,
    })
    .populate('user')
  return res.send(docContacts.map((contact) => contact.user))
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
