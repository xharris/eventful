import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import { router } from './routes'
import mongoose, { Types } from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import { Server } from 'socket.io'
import http from 'http'
import { ClientToServerEvents, Eventful, ServerToClientEvents } from 'types'
import { contact, event, tag } from './models'
import { eventAggr } from './routes/event'
import { messaging } from './fcm'
import * as notification from './notification'
import { PORT, DATABASE_URI } from './config'
import { limiter } from './util'
import { tagAggr } from './routes/tag'

const app = express()
// middleware
const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:3001',
  'http://localhost:8080',
  'http://localhost:8100',
]
const corsOptions: Parameters<typeof cors>['0'] = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Origin not allowed by CORS'))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  limiter({
    windowMs: 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
  })
)
// database
mongoose
  .connect(DATABASE_URI)
  .then(() => console.log(`Database connected to ${DATABASE_URI.replace(/:(\w+)\@/i, ':***@')}`))
  .catch(console.error)
// socket
const server = http.createServer(app)
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: corsOptions,
})
app.use((req, _, next) => {
  req.io = io
  next()
})
app.use(messaging)
app.use(notification.router)
io.on('connection', (socket) => {
  const logJoined = (user: Eventful.ID | null, roomType: string | null, roomId: Eventful.ID) =>
    console.log(
      `${socket.id} ${user ? `(${user})` : ''} join ${roomType ? `${roomType}/` : ''}${roomId}`
    )
  const logLeft = (roomType: string, roomId?: Eventful.ID) =>
    console.log(`${socket.id} left ${roomType}${roomId ? `/${roomId}` : ''}`)

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
      logJoined(user, 'event', eventId)
      socket.join(`event/${eventId}`)
    }
  })
  socket.on('event:leave', (eventId) => {
    if (!eventId || !socket.rooms.has(`event/${eventId}`)) return
    console.log(socket.id, 'leaves', `event/${eventId}`)
    logLeft('event', eventId)
  })
  socket.on('room:join', async ({ key, ref, refModel }) => {
    const roomid = `${refModel}:${key}/${ref}`
    logJoined(null, null, roomid)
    socket.join(roomid)
  })
  socket.on('room:leave', ({ key, ref, refModel }) => {
    const roomid = `${refModel}:${key}/${ref}`
    if (!socket.rooms.has(roomid)) return
    logLeft(roomid)
    socket.leave(roomid)
  })
  socket.on('user:join', async (user) => {
    // get user's contacts
    const docs = await contact.find({
      $or: [
        {
          user: user,
        },
        {
          createdBy: user,
        },
      ],
    })
    docs.forEach((doc) => {
      const other = doc.user.toString() === user.toString() ? doc.createdBy : doc.user
      logJoined(user, 'user', other)
      socket.join(`user/${other}`)
    })
  })
  socket.on('user:leave', () => {
    socket.rooms.forEach((key) => {
      if (key.startsWith('user/')) {
        logLeft(key)
        socket.leave(key)
      }
    })
  })
  socket.on('tag:join', async (user) => {
    // get user's tag memberships
    const docs = await tag.aggregate(tagAggr({ user }))
    docs.forEach((doc) => {
      logJoined(user, 'tag', doc._id)
      socket.join(`tag/${doc._id}`)
    })
  })
  socket.on('tag:leave', () => {
    socket.rooms.forEach((key) => {
      if (key.startsWith('tag/')) {
        logLeft(key)
        socket.leave(key)
      }
    })
  })
})
// routes
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../ui')))
}
app.use(morgan('tiny'))
app.use('/api', router)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../ui', 'index.html'), (err) => err && console.log(err))
  })
}
// server
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
