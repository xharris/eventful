import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.Access>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    ref: { type: Schema.Types.ObjectId, refPath: 'refModel', required: true },
    refModel: { type: String, required: true, enum: ['events', 'tags'] },
    canView: Schema.Types.Boolean,
    canEdit: Schema.Types.Boolean,
    canDelete: Schema.Types.Boolean,
    canModerate: Schema.Types.Boolean,
    isInvited: Schema.Types.Boolean,
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
