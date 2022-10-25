import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.User>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: String,
    deviceId: String,
    method: { type: String, required: true },
  },
  { timestamps: true }
)
