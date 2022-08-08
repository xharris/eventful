import { useEffect, useState } from 'react'
import { Eventful } from 'types'
import { api } from './api'

export const useSession = () => {
  const [session, setSession] = useState<Eventful.User>()

  const checkAuth = () =>
    api
      .get('auth')
      .then((res) => {
        setSession(res.data)
      })
      .catch(() => setSession(undefined))

  useEffect(() => {
    checkAuth()
  }, [])

  const logIn = (body: Eventful.API.LogInOptions) => api.post('login', body)
  const signUp = (body: Eventful.API.SignUpOptions) => api.post('signup', body)
  const logOut = () => api.get('logout').then(checkAuth)

  return {
    session,
    logIn,
    signUp,
    logOut,
  }
}
