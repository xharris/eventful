import { Schema } from 'mongoose'

export default new Schema<Eventful.Event>(
  {
    name: { type: String, required: true },
    rootGroup: { type: Schema.Types.ObjectId, ref: 'groups', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
