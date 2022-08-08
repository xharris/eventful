import { Schema } from 'mongoose'
import type { Eventful } from 'types'

export default new Schema<Eventful.LatLng>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
)
