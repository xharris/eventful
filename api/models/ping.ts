import { model } from 'mongoose'
import schema from '../schemas/ping'

export const ping = model('pings', schema)
