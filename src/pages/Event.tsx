import { useParams } from 'react-router-dom'
import { Flex, HStack } from 'src/components/Flex'
import { H1 } from 'src/components/Header'
import { Input } from 'src/components/Input'
import { useEvent } from 'src/features/event'
import { useSession } from 'src/features/session'

export const Event = () => {
  const { eventId } = useParams()
  const { data: event } = useEvent({ id: eventId })
  const { session } = useSession()

  return (
    <Flex fill css={{ alignItems: 'flex-start' }}>
      <Flex>
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
    </Flex>
  )
}
