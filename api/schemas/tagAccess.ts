import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.TagAccess>(
  {
    tag: { type: Schema.Types.ObjectId, ref: 'tags', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
