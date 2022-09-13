import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.GroupMembership>(
  {
    group: { type: Schema.Types.ObjectId, ref: 'groups', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
