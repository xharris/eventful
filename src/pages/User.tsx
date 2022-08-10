import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar } from 'src/components/Avatar'
import { AddButton, Button, RemoveButton } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { H1, H2 } from 'src/components/Header'
import { useContacts } from 'src/libs/contact'
import { useSession } from 'src/libs/session'
import { useUser } from 'src/libs/user'

export const User = () => {
  const { username } = useParams()
  const { session, logOut } = useSession()
  const navigate = useNavigate()
  const { data: user } = useUser({ username })
  const { data: contacts, addContact, removeContact } = useContacts({ user: user?._id })

  return user ? (
    <Flex fill>
      <Flex column css={{ alignItems: 'flex-start' }}>
        <Flex css={{ alignItems: 'center' }}>
          <Avatar size="large" username={user.username} />
          <H1>{username}</H1>
        </Flex>
        {session?.username === username ? (
          <Flex column>
            <Button
              onClick={() =>
                window.confirm('Are you sure you want to log out?') &&
                logOut().then(() => navigate('/'))
              }
            >
              Log out
            </Button>
          </Flex>
        ) : (
          <Flex column>
            {session &&
              (!contacts?.find((user) => user.username === username) ? (
                <AddButton onClick={() => addContact(user._id)}>Add</AddButton>
              ) : (
                <RemoveButton
                  onClick={() =>
                    window.confirm('Are you sure you want to remove this contact?') &&
                    removeContact(user._id)
                  }
                >
                  Remove
                </RemoveButton>
              ))}
          </Flex>
        )}
      </Flex>
      <Flex column>user info</Flex>
    </Flex>
  ) : (
    <Flex fill>
      <H2>Loading...</H2>
    </Flex>
  )
}
