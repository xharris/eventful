import { model } from 'mongoose'
import schema from '../schemas/tag'

export const tag = model('tags', schema)
