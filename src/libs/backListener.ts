import { useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useBackListener = ({
  hash,
  onFirstBack,
}: {
  hash: string
  onFirstBack: () => void
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  useLayoutEffect(() => {
    if (!location.hash.includes(hash)) {
      onFirstBack()
    }
  }, [hash, location, onFirstBack])
  return [
    () => navigate(`#${hash}`, { replace: location.hash === `#${hash}` }),
    /** remove hash */
    () => navigate('', { replace: location.hash === `#${hash}` }),
  ]
}
