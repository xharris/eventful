import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.Message>(
  {
    text: { type: String },
    event: { type: Schema.Types.ObjectId, ref: 'events', required: true },
    replyTo: { type: Schema.Types.ObjectId, ref: 'messages' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
