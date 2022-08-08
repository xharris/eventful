import { Link, Outlet } from 'react-router-dom'
import { Button, LinkButton } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { useSession } from 'src/features/session'
import { FiHome } from 'react-icons/fi'

export const Page = () => {
  const { session } = useSession()
  return (
    <Flex css={{ padding: '$root' }} column fill>
      <Flex row flex="0" css={{ justifyContent: 'space-between' }}>
        <Flex>
          <LinkButton to="/" variant="ghost">
            <FiHome />
          </LinkButton>
        </Flex>
        {session ? (
          <LinkButton to={`/u/${session.username}`}>{session.username}</LinkButton>
        ) : (
          <LinkButton to="/auth">Log In</LinkButton>
        )}
      </Flex>
      <Outlet />
    </Flex>
  )
}
