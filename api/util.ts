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

type RndSet = string[]
export const rnd = (() => {
  const gen = (min: number, max: number) =>
    (max++ && [...Array(max - min)].map((s, i) => String.fromCharCode(min + i))) as RndSet

  const sets = {
    num: gen(48, 57),
    alphaLower: gen(97, 122),
    alphaUpper: gen(65, 90),
    special: [...`~!@#$%^&*()_+-=[]\{}|;:'",./<>?`],
    names: ['Jimbo', 'Logan', 'Lucky', 'River', 'Vanye', 'Saisa', 'Sage', 'Sky', 'Rocket'],
  }

  function* iter(len: number, set: RndSet) {
    if (set.length < 1) set = Object.values(sets).flat()
    for (let i = 0; i < len; i++) yield set[(Math.random() * set.length) | 0]
  }

  return Object.assign((len: number, ...set: RndSet[]) => [...iter(len, set.flat())].join(''), sets)
})()

console.log(rnd(3, rnd.names))
