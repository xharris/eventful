import { Button } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { Input } from 'src/components/Input'
import { useEvents } from 'src/features/event'
import { FiPlus } from 'react-icons/fi'
import { useMemo, useState } from 'react'
import { H1, H2, H3, H4, H5, H6 } from 'src/components/Header'
import moment from 'moment'
import { Eventful } from 'types'

const Event = ({ event }: { event: Eventful.API.EventGet }) => (
  <Flex>
    <a href={`/e/${event._id}`}>
      <H3>{event.name}</H3>
    </a>
  </Flex>
)

const Month = ({
  label,
  days,
}: {
  label: string
  days: Record<string, Eventful.API.EventGet[]>
}) => (
  <Flex column>
    <H1 css={{ marginLeft: '3.5rem' }}>{label}</H1>
    <Flex column>
      <Flex column>
        {Object.entries(days).map(([day, events]) => (
          <Flex key={day} flex="0">
            <H3 css={{ color: '$disabled' }}>{day}</H3>
            <Flex column>
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
  const { data: events } = useEvents()
  const [newEventValue, setNewEventValue] = useState<string>('')

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
    <Flex column fill>
      <Flex column>
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
      <Flex css={{ flex: 0 }}>
        <Input
          variant="filled"
          name="name"
          placeholder="Add an event"
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
          onClick={() => console.log(newEventValue)}
        >
          <FiPlus />
        </Button>
      </Flex>
    </Flex>
  )
}
