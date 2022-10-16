import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.InviteLink>(
  {
    ref: { type: Schema.Types.ObjectId, refPath: 'refModel', required: true },
    refModel: { type: String, required: true, enum: ['events', 'tags', 'users'] },
    expiresAt: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
