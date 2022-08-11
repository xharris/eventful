import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_API_URL ?? '/'

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ?? '/api',
  withCredentials: true,
})
