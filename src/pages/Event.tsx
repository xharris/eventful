import { useParams } from 'react-router-dom'
import { AddButton, Button } from 'src/components/Button'
import { Flex, HStack } from 'src/components/Flex'
import { H1, H2, H4, H5, H6 } from 'src/components/Header'
import { Input } from 'src/components/Input'
import { useEvent } from 'src/libs/event'
import { useSession } from 'src/libs/session'
import { FiFile, FiSave, FiBell, FiCalendar, FiMessageSquare } from 'react-icons/fi'
import { CATEGORY, CATEGORY_INFO, usePlans } from 'src/libs/plan'
import { Agenda } from 'src/features/Agenda'
import { Eventful } from 'types'
import { useState } from 'react'
import { Plan } from 'src/features/Plan'
import { Icon, IconSide } from 'src/components/Icon'
import { useFormik } from 'formik'
import { Time } from 'src/components/Time'
import { Chat } from 'src/features/Chat'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/Popover'
import { Checkbox } from 'src/components/Checkbox'
import { useNotifications, useNotification } from 'src/libs/notification'
import { useMediaQuery } from 'src/libs/styled'
import * as Tabs from 'src/components/VerticalTabs'

const PlanControls = ({ event }: { event?: Eventful.ID }) => {
  const { session } = useSession()
  const { addPlan } = usePlans({ event })

  return session ? (
    <Flex css={{ flex: 0, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <AddButton
        variant="ghost"
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
    </Flex>
  ) : null
}

export const Event = () => {
  const { eventId } = useParams()
  const { data: event, updateEvent } = useEvent({ id: eventId })
  const { session } = useSession()
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
  const { enable, disable, isEnabled, ...notificationsQuery } = useNotifications()
  useNotification({
    ref: event?._id,
    refModel: 'events',
    key: 'message:add',
  })
  const isSmall = useMediaQuery({ maxSize: 'Tablet' })

  return (
    <Flex column fill css={{ alignItems: 'stretch', overflow: 'hidden', padding: 2 }}>
      <Flex flex="0" css={{ alignItems: 'center' }}>
        <Flex column css={{ gap: '$small' }}>
          {session?._id.toString() === event?.createdBy?.toString() ? (
            <Input
              name="name"
              defaultValue={event?.name}
              onChange={handleChange}
              variant="underline"
              placeholder="Add name"
              css={{ fontSize: '$7', flex: 1, minWidth: '50%' }}
            />
          ) : (
            <H2
              css={{
                minWidth: '50%',
              }}
            >
              {event?.name}
            </H2>
          )}
          {event?.time.start || event?.time.end ? <Time time={event.time} /> : <H6>TBD</H6>}
        </Flex>
        {dirty && (
          <Button onClick={() => submitForm()}>
            <IconSide icon={FiSave}>Save</IconSide>
          </Button>
        )}
        {event && notificationsQuery.isFetched && (
          <Popover>
            <PopoverTrigger clickable>
              <Icon icon={FiBell} size={20} subtle />
            </PopoverTrigger>
            <PopoverContent>
              <Flex column css={{ gap: '$small' }}>
                <H4 underline>Notifications</H4>
                <H5 bold>Chat</H5>
                <Checkbox
                  label="new message"
                  small
                  defaultChecked={isEnabled({
                    key: 'message:add',
                    refModel: 'events',
                    ref: event._id,
                  })}
                  onChange={(e) =>
                    e.currentTarget.checked
                      ? enable({
                          key: 'message:add',
                          refModel: 'events',
                          ref: event._id,
                        })
                      : disable({
                          key: 'message:add',
                          refModel: 'events',
                          ref: event._id,
                        })
                  }
                />
              </Flex>
            </PopoverContent>
          </Popover>
        )}
      </Flex>
      {isSmall ? (
        <Tabs.Root defaultValue="agenda">
          <Tabs.List css={{ gap: '$small' }}>
            <Tabs.Trigger value="agenda">
              <Button square={34} variant="ghost">
                <Icon icon={FiCalendar} size={18} />
              </Button>
            </Tabs.Trigger>
            <Tabs.Trigger value="chat">
              <Button square={34} variant="ghost">
                <Icon icon={FiMessageSquare} size={18} />
              </Button>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Separator />
          <Tabs.Content value="agenda">
            <PlanControls event={event?._id} />
            <Agenda
              items={event?.plans}
              noTimeHeader="Plans"
              noItemsText={`No plans yet...`}
              renderOnEveryDay={false}
              showYearSeparator={false}
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
          </Tabs.Content>
          <Tabs.Content value="chat">
            <Chat event={event?._id} />
          </Tabs.Content>
        </Tabs.Root>
      ) : (
        <Flex
          column
          css={{
            overflow: 'hidden',
            background: '$background',
            padding: 5,
            height: '100%',
          }}
        >
          <PlanControls event={event?._id} />
          <Flex
            css={{
              overflow: 'hidden',
            }}
          >
            <Agenda
              items={event?.plans}
              noTimeHeader="Plans"
              noItemsText={`No plans yet...`}
              renderOnEveryDay={false}
              showYearSeparator={false}
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
            <Chat event={event?._id} />
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}
