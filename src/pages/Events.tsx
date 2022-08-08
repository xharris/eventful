import { Button, LinkButton } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { Input } from 'src/components/Input'
import { useEvents } from 'src/features/event'
import { FiPlus } from 'react-icons/fi'
import { useMemo, useState } from 'react'
import { H1, H2, H3, H4, H5, H6 } from 'src/components/Header'
import moment from 'moment'
import { Eventful } from 'types'
import { Link, useNavigate } from 'react-router-dom'

const Event = ({ event }: { event: Eventful.API.EventGet }) => (
  <LinkButton to={`/e/${event._id}`} css={{ width: '100%' }} variant="ghost">
    <Flex>
      <H3>{event.name}</H3>
    </Flex>
  </LinkButton>
)

const Month = ({
  label,
  days,
}: {
  label: string
  days: Record<string, Eventful.API.EventGet[]>
}) => (
  <Flex column>
    <H1
      css={{
        marginLeft: '3.5rem',
        color: '#616161',
        background: 'linear-gradient(to bottom, $background 90%, transparent)',
        zIndex: 10,
        padding: '0.5rem 0',
        position: 'sticky',
        top: 0,
      }}
    >
      {label}
    </H1>
    <Flex column>
      <Flex column>
        {Object.entries(days).map(([day, events]) => (
          <Flex key={day} flex="0" css={{ position: 'relative', alignItems: 'flex-start' }}>
            <H3
              css={{
                color: '$disabled',
                position: 'sticky',
                left: 0,
                top: 0,
                padding: '0.2rem 0',
              }}
            >
              {day}
            </H3>
            <Flex column css={{ gap: '0.25rem' }}>
              {events.map((event) => (
                <Event key={event._id.toString()} event={event} />
              ))}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  </Flex>
)

export const Events = () => {
  const { data: events, createEvent } = useEvents()
  const [newEventValue, setNewEventValue] = useState<string>('')
  const navigate = useNavigate()
  const placeholders = ['Add an event', 'What are you planning?']
  const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)]

  const tbdEvents = useMemo(
    () => ({
      TBD: events?.filter((event) => !event.start) ?? [],
    }),
    [events]
  )

  const datedEvents = useMemo(
    () =>
      events
        ?.filter((event) => !!event.start)
        .reduce((months, event) => {
          const start = moment(event.start)
          const end = moment(event.end ?? event.start)
          const month = start.format('MMMM')
          // store month
          if (!months[month]) {
            months[month] = {}
          }
          // store in each day
          const days = start.diff(end, 'days')
          for (let d = 0; d < days; d++) {
            const day = start.format('D')
            if (!months[month][day]) {
              months[month][day].push(event)
            }
          }
          return months
        }, {} as Record<string, Record<string, Eventful.API.EventGet[]>>) ?? {},
    [events]
  )

  return (
    <Flex column fill css={{ gap: 0 }}>
      <Flex column css={{ overflow: 'auto' }}>
        {!!events?.length ? (
          <>
            <Month label="Still planning" days={tbdEvents} />
            {Object.entries(datedEvents).map(([month, days]) => (
              <Month key={month} label={month} days={days} />
            ))}
          </>
        ) : (
          <H1 css={{ color: '$disabled', fontStyle: 'italic' }}>
            No events yet... create one below!
          </H1>
        )}
      </Flex>
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
  )
}
