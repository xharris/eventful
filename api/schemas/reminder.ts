import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.Reminder>(
  {
    amount: { type: Schema.Types.Number, required: true, default: 1 },
    unit: {
      type: Schema.Types.String,
      required: true,
      enum: ['m', 'h', 'd', 'w', 'M'],
      default: 'h',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
