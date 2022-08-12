import { message } from 'api/models'
import express from 'express'
import { Eventful } from 'types'
import { checkSession } from './auth'

export const router = express.Router()

router.put('/message/:messageId', checkSession, async (req, res) => {
  const docMessage = await message
    .findOneAndUpdate<Eventful.API.MessageGet>(
      {
        _id: req.params.messageId,
        createdBy: req.session.user,
      },
      req.body,
      { new: true }
    )
    .populate('createdBy')
  if (!docMessage) {
    return res.sendStatus(404)
  }
  req.io.to(`event/${docMessage.event}`).emit('message:edit', docMessage)
  return res.send(docMessage)
})

router.delete('/message/:messageId', checkSession, async (req, res) => {
  const docMessage = await message.findOneAndDelete({
    _id: req.params.messageId,
    createdBy: req.session.user,
  })
  if (!docMessage) {
    return res.sendStatus(404)
  }
  req.io.to(`event/${docMessage.event}`).emit('message:delete', docMessage._id)
  return res.send(docMessage)
})
