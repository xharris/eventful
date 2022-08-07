import { Schema } from 'mongoose'
import { Eventful } from '../../types'

export default new Schema<Eventful.User>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)
