import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import { router } from './routes'
import mongoose from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import { Server } from 'socket.io'
import http from 'http'
import { ClientToServerEvents, ServerToClientEvents } from 'types'
import { event } from './models'
import { eventAggr } from './routes/event'
import { messaging } from './fcm'
import * as notification from './notification'
import { PORT, DATABASE_URI } from './config'

const app = express()
// middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// database
mongoose
  .connect(DATABASE_URI)
  .then(() => console.log(`Database connected to ${DATABASE_URI}`))
  .catch(console.error)
// socket
const server = http.createServer(app)
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: true,
    credentials: true,
  },
})
app.use((req, _, next) => {
  req.io = io
  req.fcm = messaging
  next()
})
app.use(notification.router)
io.on('connection', (socket) => {
  socket.on('event:join', async (eventId, user) => {
    if (!eventId && !user) return
    const docEvent = await event.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(eventId),
        },
      },
      ...eventAggr(user),
    ])
    if (docEvent) {
      console.log(socket.id, 'join', `event/${eventId}`)
      socket.join(`event/${eventId}`)
    }
  })
  socket.on('room:join', async ({ key, ref, refModel }) => {
    const roomid = `${refModel}:${key}/${ref}`
    console.log(socket.id, 'join', roomid)
    socket.join(roomid)
  })
  socket.on('room:leave', ({ key, ref, refModel }) => {
    const roomid = `${refModel}:${key}/${ref}`
    if (!socket.rooms.has(roomid)) return
    console.log(socket.id, 'leaves', roomid)
    socket.leave(roomid)
  })
  socket.on('event:leave', (eventId) => {
    if (!eventId || !socket.rooms.has(`event/${eventId}`)) return
    console.log(socket.id, 'leaves', `event/${eventId}`)
    socket.leave(`event/${eventId}`)
  })
})
// routes
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')))
}
app.use(morgan('tiny'))
app.use('/api', router)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'), (err) => err && console.log(err))
  })
}
// server
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
