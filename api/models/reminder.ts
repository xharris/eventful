import { model } from 'mongoose'
import schema from '../schemas/reminder'

export const reminder = model('reminders', schema)
