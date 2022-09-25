import { useCallback, useEffect, useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { Avatar } from 'src/components/Avatar'
import { Button } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { H4 } from 'src/components/Typography'
import { Icon } from 'src/components/Icon'
import { Input } from 'src/components/Input'
import { useContacts } from 'src/eventfulLib/contact'
import { useUserSearch } from 'src/eventfulLib/search'
import { useSession } from 'src/eventfulLib/session'

export const UserSearch = () => {
  const { data: users, search } = useUserSearch()
  const { session } = useSession()
  const { data: contacts, addContact } = useContacts({ user: session?._id })

  return (
    <Flex fill css={{ flexDirection: 'column' }}>
      <Input
        name="query"
        onChange={(e) => search(e.target.value)}
        placeholder="Search for users"
        css={{
          flex: 0,
        }}
      />
      <Flex css={{ flexDirection: 'column' }}>
        {users.map((user) => (
          <Flex
            key={user._id.toString()}
            css={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
            flex="0"
          >
            <Flex css={{ alignItems: 'center' }}>
              <Avatar username={user.username} size="medium" to={`/u/${user.username}`} />
              <H4>{user.username}</H4>
            </Flex>
            {user._id !== session?._id && !contacts?.some((user2) => user2._id === user._id) && (
              <Button onClick={() => addContact(user._id)}>
                <Icon icon={FiPlus} />
              </Button>
            )}
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}
