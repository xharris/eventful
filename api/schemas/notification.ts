import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.Notification>(
  {
    key: { type: String, required: true },
    ref: { type: Schema.Types.ObjectId, refPath: 'refModel', required: true },
    refModel: { type: String, required: true, enum: ['events', 'users', 'plans'] },
    id: String,
    title: String,
    body: String,
    subtitle: String,
    url: String,
    ui: Schema.Types.Boolean,
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
