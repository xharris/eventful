import { Schema } from 'mongoose'
import { Eventful } from '../../types'

export default new Schema<Eventful.Time>(
  {
    start: { type: Date, required: true },
    end: Date,
    allday: Boolean,
  },
  { timestamps: true }
)
