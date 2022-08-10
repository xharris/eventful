import express from 'express'
import auth, { checkSession } from './auth'
import * as event from './event'
import * as plan from './plan'
import * as user from './user'
import * as contact from './contact'
import type { Eventful } from 'types'

export const router = express.Router()

router.get('/', (req, res) => {
  res.send('API is running')
})

router.use(auth)

const routes = (name: string, { route }: Eventful.API.RouteOptions) => {
  if (route.getAll) {
    router.get(`/${name}s`, checkSession, route.getAll)
  }
  if (route.create) {
    router.post(`/${name}s/add`, checkSession, route.create)
  }
  router.get(`/${name}/:${name}Id`, route.get)
  router.put(`/${name}/:${name}Id`, checkSession, route.update)
  router.delete(`/${name}/:${name}Id`, checkSession, route.delete)
}

// event
routes('event', event.options)
router.use(event.router)
router.use(plan.router)
router.use(contact.router)
router.use(user.router)
