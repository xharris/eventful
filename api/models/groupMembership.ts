import { model } from 'mongoose'
import schema from '../schemas/groupMembership'

export const groupMembership = model('groupMemberships', schema)
