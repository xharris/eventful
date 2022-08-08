import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.Event>(
  {
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
