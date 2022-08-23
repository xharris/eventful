import { model } from 'mongoose'
import schema from '../schemas/userSetting'

export const userSetting = model('userSettings', schema)
