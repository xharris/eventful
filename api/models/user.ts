import { model } from 'mongoose'
import schema from '../schemas/user'

export const user = model('users', schema)
