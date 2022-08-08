import { model } from 'mongoose'
import schema from '../schemas/location'

export const location = model('locations', schema)
