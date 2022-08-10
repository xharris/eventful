import { Button, LinkButton } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { Input } from 'src/components/Input'
import { useEvents } from 'src/libs/event'
import { FiPlus } from 'react-icons/fi'
import { useMemo, useState } from 'react'
import { H1, H3, H4 } from 'src/components/Header'
import { Eventful } from 'types'
import { useNavigate } from 'react-router-dom'
import { Agenda } from 'src/features/Agenda'
import { useSession } from 'src/libs/session'

const Event = ({ event }: { event: Eventful.API.EventGet }) => (
  <LinkButton to={`/e/${event._id}`} css={{ width: '100%' }} variant="ghost">
    <Flex>
      <H3>{event.name}</H3>
    </Flex>
  </LinkButton>
)

export const Events = () => {
  const { session } = useSession()
  const { data: events, createEvent } = useEvents()
  const [newEventValue, setNewEventValue] = useState<string>('')
  const navigate = useNavigate()

  const placeholders = ['Add an event', 'What are you planning?']
  const [rand] = useState(Math.floor(Math.random() * placeholders.length))
  const placeholder = useMemo(() => placeholders[rand], [rand])

  return session ? (
    <Flex column fill css={{ gap: 0 }}>
      <Agenda
        items={events}
        noTimeHeader="Still planning"
        noTimeSubheader="TBD"
        noItemsText="No events yet... create one below!"
        renderItem={(event) => <Event key={event._id.toString()} event={event} />}
      />
      <Flex
        css={{
          flex: 0,
          paddingBottom: '$root',
          background: '$background',
        }}
      >
        <Input
          variant="filled"
          name="name"
          placeholder={placeholder}
          value={newEventValue}
          onChange={(e) => setNewEventValue(e.target.value)}
          css={{
            flex: 1,
            fontSize: '1.2rem',
          }}
        />
        <Button
          variant="ghost"
          square={39}
          disabled={!newEventValue.length}
          onClick={() =>
            createEvent({ name: newEventValue }).then((res) => navigate(`/e/${res.data._id}`))
          }
        >
          <FiPlus />
        </Button>
      </Flex>
    </Flex>
  ) : (
    <Flex column fill css={{ gap: 0, alignItems: 'center', justifyContent: 'center' }}>
      <Flex column flex="0" css={{ gap: 0 }}>
        <H1>Eventful</H1>
        <H4>{`(You need to log in)`}</H4>
      </Flex>
    </Flex>
  )
}
