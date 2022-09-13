import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.Group>(
  {
    name: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
