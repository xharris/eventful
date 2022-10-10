import { model } from 'mongoose'
import schema from '../schemas/message'

export const notification = model('notification', schema)
