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
  interface TimePart {
    date: Date
    allday: boolean
  }
  interface Time {
    start?: TimePart
    end?: TimePart
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
    event: ID
    category: CATEGORY
    what?: string
    location?: Location
    time?: Time
    who?: ID[]
  }

  interface Location extends Document {
    label?: string
    coords?: LatLng
    address?: string
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

    interface PlanGet extends Plan {
      who?: User[]
    }

    interface EventGet extends Event {
      time: Time
      groups: Group[]
      plans: PlanGet[]
    }

    type EventAdd = Pick<Event, 'name'>

    interface PlanAdd extends Omit<Plan, keyof Document | 'event'> {
      location?: LocationAdd
    }

    interface PlanEdit extends Omit<Plan, keyof Document | 'event'> {
      _id: ID
      location?: LocationAdd
      who?: User[]
      category?: Plan['category']
    }

    interface LocationAdd extends Omit<Location, keyof Document> {}

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
