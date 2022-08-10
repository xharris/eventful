import { Link, Outlet } from 'react-router-dom'
import { Button, LinkButton } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { useSession } from 'src/libs/session'
import { FiHome } from 'react-icons/fi'
import { Container } from 'src/components/Flex'

export const Page = () => {
  const { session } = useSession()
  return (
    <Container css={{ padding: '$root' }}>
      <Flex column fill>
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
    </Container>
  )
}
