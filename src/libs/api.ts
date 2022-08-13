import axios from 'axios'
import { DependencyList, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { ReservedOrUserEventNames } from 'socket.io/dist/typed-events'
import { ClientToServerEvents, ServerToClientEvents } from 'types'

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
})

type AddParameters<
  TFunction extends (...args: any) => any,
  TParameters extends [...args: any],
  TReturnType = ReturnType<TFunction>
> = (...args: [...Parameters<TFunction>, ...TParameters]) => TReturnType

type useOnHook = AddParameters<
  Socket<ServerToClientEvents, ClientToServerEvents>['on'],
  [deps?: DependencyList],
  void
>

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL ?? '/')
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  useEffect(() => {
    socket?.on('connect', () => {
      setConnected(true)
    })
    socket?.on('disconnect', () => {
      setConnected(false)
    })

    return () => {
      socket?.off('connect')
      socket?.off('disconnect')
    }
  }, [socket])

  const useOn: useOnHook = (ev, listener, deps) => {
    useEffect(() => {
      socket?.on<typeof ev>(ev, listener)

      return () => {
        socket?.off(ev)
      }
    }, [connected, socket, ev, listener, deps])
  }

  return {
    socket,
    connected,
    useOn,
  }
}
// io(process.env.REACT_APP_SOCKET_URL ?? '/')
