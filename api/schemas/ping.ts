import { Schema } from 'mongoose'
import type { Eventful } from 'types'
import Location from './location'

export default new Schema<Eventful.Ping>(
  {
    label: String,
    location: { type: Location, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
