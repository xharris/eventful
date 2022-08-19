import { model } from 'mongoose'
import schema from '../schemas/fcmToken'

export const fcmToken = model('fcmTokens', schema)
