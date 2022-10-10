import { Schema } from 'mongoose'
import LatLng from './latlng'
import type { Eventful } from 'types'

export default new Schema<Eventful.Location>(
  {
    label: String,
    coords: { type: LatLng, required: true },
    address: String,
  },
  { timestamps: true }
)
