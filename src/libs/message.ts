import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Eventful } from 'types'
import { api, socket } from './api'
import { useSession } from './session'

export const useMessages = ({ event }: { event?: Eventful.ID }) => {
  const query = useQuery<Eventful.API.MessageGet[]>(
    ['messages', { event }],
    () => api.get(`event/${event}/messages`).then((res) => res.data),
    {
      enabled: !!event,
    }
  )
  const qc = useQueryClient()
  const [connected, setConnected] = useState(false)
  const { session } = useSession()

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true)
    })
    socket.on('disconnect', () => {
      setConnected(false)
    })
    socket.on('message:add', (message) => {
      console.log('add', message)
    })
    socket.on('message:delete', (id) => {
      console.log('delete', id)
    })
    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [qc])

  useEffect(() => {
    if (connected && event && session) {
      socket.emit('event:join', event, session._id)
    }
    return () => {
      if (event) {
        socket.emit('event:leave', event)
      }
    }
  }, [connected, event, session])

  const muAddMessage = useMutation((body: Eventful.API.MessageAdd) =>
    api.post(`event/${event}/messages/add`, body)
  )

  const muDeleteMessage = useMutation((id: Eventful.ID) => api.delete(`message/${id}`))

  return {
    ...query,
    addMessage: muAddMessage.mutateAsync,
    deleteMessage: muDeleteMessage.mutateAsync,
  }
}
