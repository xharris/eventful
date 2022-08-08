import { useQuery } from '@tanstack/react-query'
import { Eventful } from 'types'
import { api } from './api'

export const useEvents = () => {
  const query = useQuery<Eventful.API.EventGet[]>(['events'], () =>
    api.get('events').then((res) => res.data)
  )

  return query
}

export const useEvent = ({ id }: { id?: string }) => {
  const query = useQuery<Eventful.API.EventGet>(
    ['event', { id }],
    () => api.get(`event/${id}`).then((res) => res.data),
    { enabled: !!id }
  )

  return query
}
