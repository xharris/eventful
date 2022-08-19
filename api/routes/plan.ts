import { plan } from 'api/models'
import express, { Request, Response } from 'express'
import { PipelineStage, Types } from 'mongoose'
import { getTitle } from 'src/eventfulLib/plan'
import { Eventful } from 'types'

export const router = express.Router()

export const planNotify = (
  req: Request,
  key: Eventful.NotificationSetting['key'],
  id: Eventful.ID,
  desc?: string
) => {
  plan
    .aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      ...planAggr(),
    ])
    .then((docs) => req.io.to(`event/${docs[0].event}`).emit(key, docs[0]))
  if (desc) {
    plan
      .findById<Eventful.Plan & { event: Eventful.Event }>(id)
      .populate('event')
      .then(
        (doc) =>
          doc &&
          req.notification.send(
            {
              refModel: 'events',
              ref: doc._id,
              key,
            },
            {
              notification: {
                title: `Plan ${desc} (${doc.event.name})`,
                body: getTitle(doc),
              },
              webpush: {
                fcmOptions: {
                  link: `${req.get('host')}/e/${doc.event._id}`,
                },
              },
            }
          )
      )
  }
}

export const planAggr: () => PipelineStage[] = () => [
  {
    $lookup: {
      from: 'users',
      localField: 'who',
      foreignField: '_id',
      as: 'who',
    },
  },
]

router.get('/plan/:planId', async (req, res) => {
  const docPlan = await plan.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(req.params.planId),
      },
    },
    ...planAggr(),
  ])
  if (!docPlan.length) {
    return res.sendStatus(404)
  }
  return res.send(docPlan[0])
})

router.put<{ planId: string }>('/plan/:planId', async (req, res) => {
  const docPlan = await plan.findOneAndUpdate(
    { _id: req.params.planId },
    {
      ...req.body,
    },
    {
      new: true,
    }
  )
  if (!docPlan) {
    return res.sendStatus(404)
  }
  planNotify(req, 'plan:edit', docPlan._id, 'updated')
  return res.send(docPlan)
})

router.delete('/plan/:planId', async (req, res) => {
  const docPlan = await plan.findOneAndDelete({ _id: req.params.planId })
  planNotify(req, 'plan:delete', new Types.ObjectId(req.params.planId))
  return res.send(docPlan)
})
