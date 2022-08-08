import { model } from 'mongoose'
import schema from '../schemas/plan'

export const plan = model('plans', schema)
