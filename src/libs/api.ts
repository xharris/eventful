import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_API_URL ?? '/'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})
