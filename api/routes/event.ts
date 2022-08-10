import { event, group, plan, location } from 'api/models'
import { PipelineStage, Types } from 'mongoose'
import { Eventful } from 'types'
import express from 'express'
import { checkSession } from './auth'

const eventAggr: PipelineStage[] = [
  {
    $lookup: {
      from: 'plans',
      localField: '_id',
      foreignField: 'event',
      as: 'plans',
      pipeline: [
        {
          $lookup: {
            from: 'users',
            localField: 'who',
            foreignField: '_id',
            as: 'who',
          },
        },
      ],
    },
  },
]

export const options: Eventful.API.RouteOptions = {
  route: {
    create: async (req, res) => {
      const docEvent = await event.create({
        name: req.body.name ?? 'new event',
        createdBy: req.session.user?._id,
      })
      await group.create({
        name: 'root',
        event: docEvent,
        isRoot: true,
        createdBy: req.session.user?._id,
      })
      return res.send(docEvent)
    },
    getAll: async (req, res) => {
      /*
        Get events...
          - created by session user
          - where plan.event == eventId && plan.who.includes(session user)
          - where plan.event == eventId && plan.createdBy == session user
      */
      const docEvents: Eventful.API.EventGet[] = await event.aggregate([
        {
          $match: {
            createdBy: new Types.ObjectId(req.session.user?._id),
          },
        },
        ...eventAggr,
      ])
      return res.send(docEvents)
    },
    get: async (req, res) => {
      const docEvents = await event.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(req.params.eventId),
          },
        },
        ...eventAggr,
      ])
      if (!docEvents.length) {
        return res.sendStatus(404)
      }
      return res.send(docEvents[0])
    },
    update: async (req, res) => {
      const docEvent = await event.findByIdAndUpdate(
        req.params.eventId,
        {
          name: req.body.name,
        },
        {
          new: true,
        }
      )
      return res.send(docEvent)
    },
    delete: async (req, res) => {
      const docRes = await event.deleteOne({ _id: req.params.eventId })
      return res.send(docRes)
    },
  },
}

export const router = express.Router()

router.post<{ eventId: string }>('/event/:eventId/plans/add', checkSession, async (req, res) => {
  console.log(req.session)
  const docPlan = await plan.create({
    who: [],
    category: req.body.category ?? 0,
    time: req.body.time,
    what: req.body.what ?? '',
    location: req.body.location,
    createdBy: req.session.user,
    event: new Types.ObjectId(req.params.eventId),
  })
  return res.send(docPlan)
})
