import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.Contact>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
