import express, { RequestHandler } from 'express'
import auth, { checkSession } from './auth'
import event from './event'
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
  router.get(`/${name}/:${name}Id`, checkSession, route.get)
  router.put(`/${name}/:${name}Id`, checkSession, route.update)
  router.delete(`/${name}/:${name}Id`, checkSession, route.delete)
}

routes('event', event)
