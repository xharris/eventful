import { model } from 'mongoose'
import user from '../schemas/user'

export default model('users', user)
