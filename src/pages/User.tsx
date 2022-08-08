import { useParams } from 'react-router-dom'
import { Button } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { H1 } from 'src/components/Header'
import { useSession } from 'src/features/session'

export const User = () => {
  const { username } = useParams()
  const { session, logOut } = useSession()

  return (
    <Flex fill>
      <Flex column css={{ alignItems: 'flex-start' }}>
        <H1>{username}</H1>
        {session?.username === username && (
          <Button onClick={() => window.confirm('Are you sure you want to log out?') && logOut()}>
            Log out
          </Button>
        )}
      </Flex>
      <Flex column>user info</Flex>
    </Flex>
  )
}
