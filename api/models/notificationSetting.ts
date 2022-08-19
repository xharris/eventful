import { model } from 'mongoose'
import schema from '../schemas/notificationSetting'

export const notificationSetting = model('notificationSettings', schema)
