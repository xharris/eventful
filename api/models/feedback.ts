import { model } from 'mongoose'
import schema from '../schemas/feedback'

export const feedback = model('feedbacks', schema)
