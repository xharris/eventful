import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.Group>(
  {
    name: { type: String, required: true },
    category: { type: Number, required: true, default: 0 },
    event: { type: Schema.Types.ObjectId, required: true },
    isRoot: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
