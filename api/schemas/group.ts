import { Schema } from 'mongoose'
import { Eventful } from '../../types'

export default new Schema<Eventful.Group>(
  {
    name: { type: String, required: true },
    category: { type: Number, required: true, default: Eventful.CATEGORY.None },
    event: { type: Schema.Types.ObjectId, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
