import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Eventful } from 'types'
import { api } from './api'
import { createStateContext } from 'react-use'

const [useSessionCtx, Provider] = createStateContext<Eventful.User | null>(null)

export const SessionProvider = Provider

export const useSession = (verify: boolean = false) => {
  const [session, setSession] = useSessionCtx()

  const checkAuth = useCallback(
    () =>
      verify
        ? api
            .get('auth')
            .then((res) => {
              setSession(res.data)
            })
            .catch(() => setSession(null))
        : Promise.resolve(),
    [verify]
  )

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
