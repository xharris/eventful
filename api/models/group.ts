import { model } from 'mongoose'
import schema from '../schemas/group'

export const group = model('groups', schema)
