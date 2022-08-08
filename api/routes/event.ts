import { event, group } from 'api/models'
import { Types } from 'mongoose'
import { Eventful } from 'types'

const options: Eventful.API.RouteOptions = {
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
      ])
      return res.send(docEvents)
    },
    get: async (req, res) => {
      const docEvent = await event.findById(req.params.eventId)
      return res.send(docEvent)
    },
    update: (req, res) => {},
    delete: (req, res) => {},
  },
}

export default options
