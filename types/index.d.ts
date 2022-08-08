import { RequestHandler } from 'express'
import { Types } from 'mongoose'

declare namespace Eventful {
  export type ID = Types.ObjectId
  export enum CATEGORY {
    None,
    Lodging,
    Carpool,
    Meet,
  }
  interface LatLng {
    latitude: number
    longitude: number
  }
  interface Time {
    start?: Date
    end?: Date
    allday?: boolean
  }

  interface Document {
    _id: ID
    createdBy?: ID
    createdAt: Date
    updatedAt: Date
  }

  interface Event extends Document {
    name: string
  }

  interface Group extends Document {
    name: string
    category: CATEGORY
    event: ID
    isRoot: boolean
  }

  interface Plan extends Document {
    what: string
    location: ID
    time: Time
    who: ID[]
  }

  interface Location extends Document {
    label?: string
    coords: LatLng
    address: string
  }

  interface User extends Document {
    username: string
    password: string
  }

  interface Contact extends Document {
    user: ID
  }

  namespace API {
    interface RouteOptions {
      route: {
        getAll?: RequestHandler
        create?: RequestHandler
        get: RequestHandler
        update: RequestHandler
        delete: RequestHandler
      }
    }

    interface EventGet extends Event {
      start: Date
      end?: Date
      allday?: boolean
      groups: Group[]
    }

    type EventAdd = Pick<Event, 'name'>

    interface LogInOptions {
      username: string
      password: string
      remember?: boolean
    }

    interface SignUpOptions {
      username: string
      password: string
      confirm_password: string
      remember?: boolean
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    user: Eventful.User
  }
}
