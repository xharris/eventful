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

export const filterKeys = <T extends Record<string, any> = Record<string, any>>(
  obj: T,
  keys: (keyof T)[],
  include = false
) =>
  Object.keys(obj)
    .filter((key) => include === keys.includes(key))
    .reduce(
      (ret, key) => ({
        ...ret,
        [key]: obj[key],
      }),
      {} as T
    )
