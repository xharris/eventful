import { model } from 'mongoose'
import schema from '../schemas/event'

export const event = model('events', schema)
