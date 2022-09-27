import { Link, Outlet } from 'react-router-dom'
import { Button, LinkButton } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { useSession } from 'src/eventfulLib/session'
import { FiHome, FiUsers } from 'react-icons/fi'
import { Container } from 'src/components/Flex'
import { useEffect } from 'react'
import { Avatar } from 'src/components/Avatar'

export const Page = () => {
  const { session } = useSession()

  return (
    <Container
      css={{
        padding: '$small',
        '@phablet': {
          padding: '$root',
        },
      }}
    >
      <Flex column fill css={{ gap: '$small' }}>
        <Flex className="page-header" row flex="0" css={{ justifyContent: 'space-between' }}>
          <Flex>
            <LinkButton to="/" variant="ghost" title="Home">
              <FiHome />
            </LinkButton>
            <LinkButton to="/users/search" variant="ghost" title="User search">
              <FiUsers />
            </LinkButton>
          </Flex>
          {session ? (
            <Avatar username={session.username} size="medium" to={`/u/${session.username}`} />
          ) : (
            // <LinkButton to={`/u/${session.username}`}>{session.username}</LinkButton>
            <LinkButton to="/auth">Log In</LinkButton>
          )}
        </Flex>
        <Outlet />
      </Flex>
    </Container>
  )
}
