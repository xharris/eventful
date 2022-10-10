import { Schema } from 'mongoose'
import type { Eventful } from 'types'
import location from './location'

export default new Schema<Eventful.Ping>(
  {
    type: { type: String, required: true },
    label: String,
    tags: { type: [Schema.Types.ObjectId], ref: 'tags', required: true },
    location: { type: location, required: true },
    time: Date,
    scope: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
