import { notificationSetting } from 'api/models'
import express from 'express'
import { checkSession } from './auth'

export const router = express.Router()

router.get('/notifications/settings', checkSession, async (req, res) => {
  const docNotifSettings = await notificationSetting.find({
    createdBy: req.session.user?._id,
  })
  return res.send(docNotifSettings)
})

router.get('/notifications/:source/:sourceId', checkSession, async (req, res) => {
  const docNotifSettings = await notificationSetting.find({
    refModel: req.params.source,
    ref: req.params.sourceId,
    createdBy: req.session.user?._id,
  })
  return res.send(docNotifSettings)
})

router.get('/notifications/:source/:sourceId/:key/enable', checkSession, async (req, res) => {
  const docNotifSetting = await notificationSetting.updateOne(
    {
      key: req.params.key,
      refModel: req.params.source,
      ref: req.params.sourceId,
      createdBy: req.session.user?._id,
    },
    {},
    {
      upsert: true,
    }
  )
  return res.send(docNotifSetting)
})

router.get('/notifications/:source/:sourceId/:key/disable', async (req, res) => {
  const docNotifSetting = await notificationSetting.deleteOne({
    key: req.params.key,
    refModel: req.params.source,
    ref: req.params.sourceId,
    createdBy: req.session.user?._id,
  })
  return res.send(docNotifSetting)
})
