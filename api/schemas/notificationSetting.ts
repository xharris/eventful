import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.NotificationSetting>(
  {
    key: { type: String, required: true },
    ref: { type: Schema.Types.ObjectId, refPath: 'refModel', required: true },
    refModel: { type: String, required: true, enum: ['events', 'users', 'plans'] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
