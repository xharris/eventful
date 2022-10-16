import { model } from 'mongoose'
import schema from '../schemas/inviteLink'

export const inviteLink = model('inviteLinks', schema)
