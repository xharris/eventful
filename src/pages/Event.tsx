import { useParams } from 'react-router-dom'
import { AddButton, Button } from 'src/components/Button'
import { Flex, HStack } from 'src/components/Flex'
import { H1, H3 } from 'src/components/Header'
import { Input } from 'src/components/Input'
import { useEvent } from 'src/libs/event'
import { useSession } from 'src/libs/session'
import { FiFile, FiSave } from 'react-icons/fi'
import { CATEGORY, CATEGORY_INFO, usePlans } from 'src/libs/plan'
import { Agenda } from 'src/features/Agenda'
import { Eventful } from 'types'
import { useState } from 'react'
import { Plan } from 'src/features/Plan'
import { Icon, IconSide } from 'src/components/Icon'
import { useFormik } from 'formik'
import { Time } from 'src/components/Time'

export const Event = () => {
  const { eventId } = useParams()
  const { data: event, updateEvent } = useEvent({ id: eventId })
  const { session } = useSession()
  const { addPlan } = usePlans({ event: eventId })
  const [editing, setEditing] = useState<Eventful.ID>()
  const { dirty, handleChange, submitForm } = useFormik<Eventful.API.EventUpdate>({
    initialValues: {
      name: event?.name ?? '',
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      updateEvent(values)
    },
  })

  return (
    <Flex column fill css={{ alignItems: 'stretch' }}>
      <Flex flex="0" css={{ alignItems: 'center' }}>
        <Flex column>
          {session?._id.toString() === event?.createdBy?.toString() ? (
            <Input
              name="name"
              defaultValue={event?.name}
              onChange={handleChange}
              variant="underline"
              placeholder="Add name"
              css={{ fontSize: '$6', flex: 1, minWidth: '50%' }}
            />
          ) : (
            <H1
              css={{
                minWidth: '50%',
              }}
            >
              {event?.name}
            </H1>
          )}
          {event?.time.start || event?.time.end ? (
            <Time time={event.time} css={{ fontSize: '$6' }} />
          ) : (
            <Flex css={{ fontSize: '$6' }}>TBD</Flex>
          )}
        </Flex>
        {dirty && (
          <Button onClick={() => submitForm()}>
            <IconSide icon={FiSave}>Save</IconSide>
          </Button>
        )}
      </Flex>
      <Flex
        css={{
          flexDirection: 'column',
          '@phablet': {
            flexDirection: 'row',
          },
        }}
      >
        <Agenda
          items={event?.plans}
          noTimeHeader="Plans"
          noItemsText={`No plans yet...${session ? ' create some below!' : ''}`}
          renderOnEveryDay={false}
          renderItem={(plan) => (
            <Plan
              key={plan._id.toString()}
              plan={plan}
              editing={editing === plan._id}
              onEdit={() => {
                setEditing(plan._id)
              }}
              onClose={() => setEditing(undefined)}
            />
          )}
        />
        <Flex></Flex>
      </Flex>
      <Flex
        column
        css={{
          flex: 0,
          background: '$background',
        }}
      >
        {session && (
          <Flex css={{ justifyContent: 'space-between' }}>
            <HStack>
              <AddButton
                variant="filled"
                css={{ display: 'flex', gap: 4, alignItems: 'center' }}
                onClick={() =>
                  addPlan({
                    category: 0,
                  })
                }
              >
                <FiFile />
                {CATEGORY_INFO[0].label}
              </AddButton>
            </HStack>
            <HStack>
              {Object.entries(CATEGORY_INFO)
                .filter(([key]) => parseInt(key) != CATEGORY.None)
                .map(([key, cat]) => (
                  <AddButton
                    key={key}
                    variant="outline"
                    css={{ display: 'flex', gap: 4, alignItems: 'center' }}
                    onClick={() => addPlan({ category: parseInt(key) })}
                  >
                    <IconSide icon={cat.icon}>{cat.label}</IconSide>
                  </AddButton>
                ))}
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
        )}
      </Flex>
    </Flex>
  )
}
