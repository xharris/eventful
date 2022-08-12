import { RequestHandler } from 'express'
import { SessionData } from 'express-session'
import { Session } from 'inspector'
import { Types } from 'mongoose'
import { Server } from 'socket.io'

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
    /** Date */
    createdAt: string
    /** Date */
    updatedAt: string
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

  interface Message extends Document {
    text: string
    event: ID
    replyTo: ID
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
      who: User[]
    }

    interface EventUpdate extends Omit<Event, keyof Document> {}

    type EventAdd = Pick<Event, 'name'>

    interface PlanAdd extends Omit<Plan, keyof Document | 'event'> {
      location?: LocationAdd
    }

    interface PlanEdit extends Omit<Plan, keyof Document | 'event'> {
      _id: ID
      location?: LocationAdd
      who?: ID[]
      category?: Plan['category']
    }

    interface LocationAdd extends Omit<Location, keyof Document> {}

    interface MessageGet extends Message {
      createdBy: User
    }

    interface MessageAdd extends Pick<Message, 'text' | 'replyTo'> {
      replyTo?: Message['replyTo']
    }

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

export interface ClientToServerEvents {
  'event:join': (event: Eventful.ID, user: Eventful.ID) => void
  'event:leave': (event: Eventful.ID) => void
}

export interface ServerToClientEvents {
  'message:add': (message: Eventful.API.MessageGet) => void
  'message:edit': (message: Eventful.API.MessageGet) => void
  'message:delete': (message: Eventful.ID) => void
}

declare module 'express-session' {
  interface SessionData {
    user: Eventful.User
  }
}

declare global {
  namespace Express {
    interface Request {
      io: Server<ClientToServerEvents, ServerToClientEvents>
      session: (Session & Partial<SessionData>) | null
    }
  }
}
