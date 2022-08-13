import { model } from 'mongoose'
import schema from '../schemas/message'

export const message = model('messages', schema)
