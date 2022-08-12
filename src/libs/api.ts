import axios from 'axios'
import { io, Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from 'types'

axios.defaults.baseURL = process.env.REACT_APP_API_URL ?? '/'

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ?? '/api',
  withCredentials: true,
})

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.REACT_APP_SOCKET_URL ?? '/'
)
