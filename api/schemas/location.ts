import { Schema } from 'mongoose'
import LatLng from './latlng'
import type { Eventful } from 'types'

export default new Schema<Eventful.Location>(
  {
    label: String,
    coords: { type: LatLng },
    address: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
)
