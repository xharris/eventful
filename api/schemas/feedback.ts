import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.Feedback>(
  {
    text: { type: Schema.Types.String, required: true },
    type: {
      type: Schema.Types.String,
      enum: ['question', 'suggestion', 'bug', 'other'],
      required: true,
    },
    logs: Schema.Types.String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
