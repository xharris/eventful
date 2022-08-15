import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMessaging, getToken } from 'firebase/messaging'
import { useCallback, useEffect, useMemo } from 'react'
import { Eventful } from 'types'
import { api } from './api'

export { getToken } from 'firebase/messaging'

const requestPermission = () =>
  new Promise<void>((res, rej) => {
    Notification.requestPermission().then((permission) => {
      if (permission !== 'granted') {
        return rej()
      }
      try {
        const messaging = getMessaging()
        getToken(messaging).then((token) => {
          if (!token) {
            return rej()
          }
          api.post('fcm', { token }).then(() => {
            res()
          })
        })
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message)
        }
        return rej()
      }
    })
  })

export const useNotification = ({
  ref,
  refModel,
  key,
}: Partial<Pick<Eventful.NotificationSetting, 'key' | 'refModel' | 'ref'>>) => {
  const query = useQuery(
    ['notifications'],
    () =>
      api
        .get<Eventful.NotificationSetting[]>(`notifications/${refModel}/${ref}`)
        .then((res) => res.data),
    {
      enabled: !!(ref && refModel && key),
    }
  )
  const { data } = query
  const ns = useMemo(() => data?.find((ns) => ns.key === key), [data, key])

  useEffect(() => {
    if (ns) {
      requestPermission()
    }
  }, [ns])

  return {
    ...query,
  }
}

export const useNotifications = () => {
  const query = useQuery(['notifications'], () =>
    api.get<Eventful.NotificationSetting[]>(`notifications/settings`).then((res) => res.data)
  )
  const { data } = query
  const qc = useQueryClient()

  const isEnabled = useCallback(
    ({
      key,
      refModel,
      ref,
    }: Partial<Pick<Eventful.NotificationSetting, 'key' | 'refModel' | 'ref'>>) =>
      data?.some((ns) => ns.key === key && ns.refModel === refModel && ns.ref === ref),
    [data]
  )

  const muEnable = useMutation(
    ({ key, refModel, ref }: Pick<Eventful.NotificationSetting, 'key' | 'refModel' | 'ref'>) =>
      api.get(`/notifications/${refModel}/${ref}/${key}/enable`),
    {
      onSuccess: () => {
        qc.invalidateQueries(['notifications'])
      },
    }
  )

  const muDisable = useMutation(
    ({ key, refModel, ref }: Pick<Eventful.NotificationSetting, 'key' | 'refModel' | 'ref'>) =>
      api.get(`/notifications/${refModel}/${ref}/${key}/disable`),
    {
      onSuccess: () => {
        qc.invalidateQueries(['notifications'])
      },
    }
  )

  return {
    ...query,
    isEnabled,
    enable: muEnable.mutateAsync,
    disable: muDisable.mutateAsync,
  }
}
