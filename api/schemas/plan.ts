import { Schema } from 'mongoose'
import { Eventful } from '../../types'
import Time from './time'

export default new Schema<Eventful.Plan>(
  {
    what: String,
    location: { type: Schema.Types.ObjectId, ref: 'locations' },
    time: Time,
    who: { type: [Schema.Types.ObjectId], ref: 'users' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
