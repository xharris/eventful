import { Eventful } from 'types'

export const cleanUser = (user: Eventful.User) => {
  delete (user as Partial<Eventful.User>).password
}
