import { Schema } from 'mongoose'
import { Eventful } from 'types'

const TimePart = new Schema<Eventful.TimePart>({
  date: { type: Date, required: true },
  allday: Boolean,
})

export default new Schema<Eventful.Time>(
  {
    start: TimePart,
    end: TimePart,
  },
  { timestamps: true }
)
