import { plan } from 'api/models'
import express, { Request, Response } from 'express'
import { PipelineStage, Types } from 'mongoose'
import { Eventful } from 'types'

export const CATEGORY = {
  None: 0,
  Lodging: 1,
  Carpool: 2,
  Meet: 3,
}

export const getTitle = (plan: Eventful.Plan) =>
  plan.category === CATEGORY.Carpool
    ? `${plan.what} carpool`
    : plan.category === CATEGORY.Lodging || plan.category === CATEGORY.Meet
    ? plan.location?.label ?? plan.location?.address
    : !!plan.what?.length
    ? plan.what
    : 'Untitled plan'

export const router = express.Router()

export const planNotify = async (
  req: Request,
  key: Eventful.NotificationSetting['key'],
  id: Eventful.ID,
  desc?: string
) => {
  await plan
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
    await plan
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
              general: {
                title: `Plan ${desc} (${doc.event.name})`,
                body: getTitle(doc),
                url: `${req.get('host')}/e/${doc.event._id}`,
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
      pipeline: [
        {
          $project: {
            password: 0,
          },
        },
      ],
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
  await planNotify(req, 'plan:delete', new Types.ObjectId(req.params.planId))
  const docPlan = await plan.findOneAndDelete({ _id: req.params.planId })
  return res.send(docPlan)
})
