import { Schema } from 'mongoose'

export default new Schema<Eventful.LatLng>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
)
