import { model } from 'mongoose'
import schema from '../schemas/access'

export const access = model('accesses', schema)
