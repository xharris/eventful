import { model } from 'mongoose'
import schema from '../schemas/tagAccess'

export const tagAccess = model('tagAccess', schema)
