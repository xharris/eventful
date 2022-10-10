import { useCallback, useEffect } from 'react'
import { Button, LinkButton } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { Input } from 'src/components/Input'
import { useEvents } from 'src/eventfulLib/event'
import { FiPlus } from 'react-icons/fi'
import { useMemo, useState } from 'react'
import { H1, H2, H3, H4, H5, H6 } from 'src/components/Typography'
import { Eventful } from 'types'
import { useNavigate } from 'react-router-dom'
import { Agenda } from 'src/features/Agenda'
import { useSession } from 'src/eventfulLib/session'
import { Time } from 'src/components/Time'
import { AvatarGroup } from 'src/components/Avatar'
import moment from 'moment'

const Event = ({ event }: { event: Eventful.API.EventGet }) => (
  <LinkButton
    to={`/e/${event._id}`}
    linkProps={{
      style: { width: '100%' },
    }}
    css={{ padding: '0.3rem', width: '100%' }}
    variant="ghost"
  >
    <Flex
      css={{
        opacity:
          event.time &&
          event.time.start &&
          moment(event.time.end?.date ?? event.time.start.date).isSameOrBefore(moment.now())
            ? 0.4
            : 1,
      }}
    >
      <Flex css={{ alignItems: 'center' }}>
        <H4 css={{ fontWeight: 600, textAlign: 'left' }}>{event.name}</H4>
        <H4>
          <Time time={event.time} timeOnly />
        </H4>
      </Flex>
      <AvatarGroup
        avatars={event.who.map((user) => ({
          username: user.username,
        }))}
      />
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

  const submit = useCallback(
    () => createEvent({ name: newEventValue }).then((res) => navigate(`/e/${res.data._id}`)),
    [newEventValue, navigate]
  )

  return session ? (
    <Flex column fill css={{ gap: 0, overflow: 'hidden' }}>
      <Agenda
        items={events}
        noTimeHeader="TBD"
        // noTimeSubheader="TBD"
        noItemsText="No events yet... create one below!"
        renderItem={(event) => <Event event={event} />}
      />
      <Flex
        css={{
          flex: 0,
          paddingBottom: '$root',
          paddingLeft: '$small',
          paddingRight: '$small',
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
          }}
          onKeyDown={(e) => e.key.match(/enter/i) && submit()}
        />
        <Button
          variant="ghost"
          square={39}
          disabled={!newEventValue.length}
          onClick={() => submit()}
          title="Add event"
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
