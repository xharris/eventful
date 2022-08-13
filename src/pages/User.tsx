import { useEffect, useMemo } from 'react'
import { FiMinus } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar } from 'src/components/Avatar'
import { AddButton, Button, RemoveButton } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { H1, H2, H3, H4, H5, H6 } from 'src/components/Header'
import { Icon } from 'src/components/Icon'
import { useContacts } from 'src/libs/contact'
import { useSession } from 'src/libs/session'
import { useUser } from 'src/libs/user'

export const User = () => {
  const { username } = useParams()
  const { session, logOut } = useSession()
  const isMe = useMemo(() => username === session?.username, [session, username])

  const navigate = useNavigate()
  const { data: user } = useUser({ username })
  const { data: contacts, addContact, removeContact } = useContacts({ user: session?._id })

  return user ? (
    <Flex
      fill
      css={{
        flexDirection: 'column',
        '@phablet': {
          flexDirection: 'row',
        },
      }}
    >
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
              contacts &&
              (!contacts.find((user) => user.username === username) ? (
                <AddButton onClick={() => addContact(user._id)} title="Add contact">
                  Add
                </AddButton>
              ) : (
                <RemoveButton
                  onClick={() =>
                    window.confirm('Are you sure you want to remove this contact?') &&
                    removeContact(user._id)
                  }
                  title="Remove contact"
                >
                  Remove
                </RemoveButton>
              ))}
          </Flex>
        )}
      </Flex>
      <Flex column>
        {isMe && (
          <Flex column>
            <H3>Contacts</H3>
            {!contacts?.length ? (
              <H4 subtle>None yet...</H4>
            ) : (
              <Flex column className="contacts" css={{ alignItems: 'flex-start' }}>
                {contacts.map((contact) => (
                  <Flex
                    key={contact._id.toString()}
                    css={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
                    flex="0"
                  >
                    <Flex css={{ alignItems: 'center' }}>
                      <Avatar
                        username={contact.username}
                        size="medium"
                        to={`/u/${contact.username}`}
                      />
                      <H4>{contact.username}</H4>
                    </Flex>
                    <Button
                      onClick={() =>
                        window.confirm('Are you sure you want to remove this contact?') &&
                        removeContact(contact._id)
                      }
                    >
                      <Icon icon={FiMinus} />
                    </Button>
                  </Flex>
                ))}
              </Flex>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  ) : (
    <Flex fill>
      <H2>Loading...</H2>
    </Flex>
  )
}
