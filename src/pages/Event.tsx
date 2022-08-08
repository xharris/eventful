import { useParams } from 'react-router-dom'
import { Button } from 'src/components/Button'
import { Flex, HStack } from 'src/components/Flex'
import { H1 } from 'src/components/Header'
import { Input } from 'src/components/Input'
import { useEvent } from 'src/features/event'
import { useSession } from 'src/features/session'
import { FiPlus, FiTruck, FiHome, FiFile, FiMapPin } from 'react-icons/fi'
import { useState } from 'react'

export const Event = () => {
  const { eventId } = useParams()
  const { data: event } = useEvent({ id: eventId })
  const { session } = useSession()
  const [newPlanText, setNewPlanText] = useState('')

  return (
    <Flex column fill css={{ alignItems: 'stretch' }}>
      <Flex css={{ alignItems: 'flex-start' }}>
        {session?._id.toString() === event?.createdBy?.toString() ? (
          <Input
            name="name"
            defaultValue={event?.name}
            onChange={(e) => console.log(e.target.value)}
            variant="filled"
            placeholder="Add name"
            css={{ fontSize: '$6', flex: 1 }}
          />
        ) : (
          <H1>{event?.name}</H1>
        )}
      </Flex>
      <Flex
        column
        css={{
          flex: 0,
          paddingBottom: '$root',
          background: '$background',
        }}
      >
        <Flex css={{ justifyContent: 'space-between' }}>
          <HStack>
            <Button variant="filled" css={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <FiFile />
              Blank
              <FiPlus />
            </Button>
          </HStack>
          <HStack>
            <Button variant="outline" css={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <FiMapPin />
              Location
              <FiPlus />
            </Button>
            <Button variant="outline" css={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <FiHome />
              Lodging
              <FiPlus />
            </Button>
            <Button variant="outline" css={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <FiTruck />
              Carpool
              <FiPlus />
            </Button>
            {/* <Input
              name="name"
              placeholder="Search..."
              value={newPlanText}
              onChange={(e) => setNewPlanText(e.target.value)}
              css={{
                flex: 1,
                fontSize: '0.75rem',
                height: '1rem',
              }}
            /> */}
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  )
}
