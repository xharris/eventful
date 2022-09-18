import { Eventful } from 'types'
import ratelimit from 'express-rate-limit'
import { RequestHandler } from 'express'

export const cleanUser = (user: Eventful.User) => {
  delete (user as Partial<Eventful.User>).password
}

export const limiter = (...props: Parameters<typeof ratelimit>) => {
  if (process.env.NODE_ENV === 'test') {
    return ((_, __, next) => next()) as RequestHandler
  }
  return ratelimit(...props)
}
