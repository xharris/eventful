import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.Event>(
  {
    name: { type: String, required: true },
    private: Schema.Types.Boolean,
    tags: { type: [Schema.Types.ObjectId], ref: 'tags', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
