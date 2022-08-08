import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.Time>(
  {
    start: Date,
    end: Date,
    allday: Boolean,
  },
  { timestamps: true }
)
