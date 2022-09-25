import { Button, LinkButton } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { Input } from 'src/components/Input'
import { useEvents } from 'src/eventfulLib/event'
import { FiPlus } from 'react-icons/fi'
import { useMemo, useState } from 'react'
import { H1, H3, H4, H5 } from 'src/components/Typography'
import { Eventful } from 'types'
import { useHistory } from 'react-router-dom'
import { Agenda } from 'src/features/Agenda'
import { useSession } from 'src/eventfulLib/session'
import { Time } from 'src/components/Time'
import { AvatarGroup } from 'src/components/Avatar'
import { Page } from './Page'

const Event = ({ event }: { event: Eventful.API.EventGet }) => (
  <LinkButton
    to={`/e/${event._id}`}
    linkProps={{
      style: { width: '100%' },
    }}
    css={{ padding: '0.3rem', width: '100%' }}
    variant="ghost"
  >
    <Flex>
      <Flex css={{ alignItems: 'center' }}>
        <H4 css={{ fontWeight: 600 }}>{event.name}</H4>
        <H4>
          <Time time={event.time} />
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
  const history = useHistory()

  const placeholders = ['Add an event', 'What are you planning?']
  const [rand] = useState(Math.floor(Math.random() * placeholders.length))
  const placeholder = useMemo(() => placeholders[rand], [rand])

  return (
    <Page>
      {session ? (
        <Flex column fill css={{ gap: 0, overflow: 'hidden' }}>
          <Agenda
            items={events}
            noTimeHeader="TBD"
            // noTimeSubheader="TBD"
            noItemsText="No events yet... create one below!"
            renderItem={(event) => <Event event={event} />}
            renderOnEveryDay={false}
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
                fontSize: '1.2rem',
              }}
            />
            <Button
              variant="ghost"
              square={39}
              disabled={!newEventValue.length}
              onClick={() =>
                createEvent({ name: newEventValue }).then((res) =>
                  history.push(`/e/${res.data._id}`)
                )
              }
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
      )}
    </Page>
  )
}
