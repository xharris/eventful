import { model } from 'mongoose'
import schema from '../schemas/contact'

export const contact = model('contact', schema)
