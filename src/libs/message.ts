import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Eventful } from 'types'
import { api, useSocket } from './api'
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

  const { session } = useSession()
  const { socket, connected, useOn } = useSocket()

  useOn(
    'message:add',
    (message: Eventful.API.MessageGet) => {
      qc.setQueriesData<Eventful.API.MessageGet[]>(['messages', { event }], (old = []) => [
        ...old,
        message,
      ])
    },
    [qc, event]
  )

  useOn(
    'message:edit',
    (message: Eventful.API.MessageGet) => {
      qc.setQueriesData<Eventful.API.MessageGet[]>(['messages', { event }], (old = []) =>
        old.map((message2) => (message._id === message2._id ? message : message2))
      )
    },
    [qc, event]
  )

  useOn(
    'message:delete',
    (id: Eventful.ID) => {
      qc.setQueriesData<Eventful.API.MessageGet[]>(['messages', { event }], (old = []) =>
        old.filter((message) => message._id !== id)
      )
    },
    [qc, event]
  )

  useEffect(() => {
    if (socket && connected && event && session) {
      socket.emit('event:join', event, session._id)
    }
    return () => {
      if (socket && event) {
        socket.emit('event:leave', event)
      }
    }
  }, [connected, event, session, socket])

  // useEffect(() => {
  //   socket.on('connect', () => {
  //     setConnected(true)
  //   })
  //   socket.on('disconnect', () => {
  //     setConnected(false)
  //   })
  //   socket.on('message:add', (message) => {
  //     console.log('add', message)
  //   })
  //   socket.on('message:delete', (id) => {
  //     console.log('delete', id)
  //   })
  //   return () => {
  //     socket.off('connect')
  //     socket.off('disconnect')
  //     socket.off('message:add')
  //     socket.off('message:delete')
  //   }
  // }, [qc])

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
