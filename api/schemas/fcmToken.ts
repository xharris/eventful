import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.FcmToken>(
  {
    token: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
