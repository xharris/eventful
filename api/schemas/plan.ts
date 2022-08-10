import { Schema } from 'mongoose'
import type { Eventful } from 'types'
import Location from './location'
import Time from './time'

export default new Schema<Eventful.Plan>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'events', required: true },
    what: String,
    category: { type: Number, required: true, default: 0 },
    location: Location,
    time: Time,
    who: { type: [Schema.Types.ObjectId], ref: 'users', default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
