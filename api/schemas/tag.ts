import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.Tag>(
  {
    name: { type: String, required: true },
    color: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
