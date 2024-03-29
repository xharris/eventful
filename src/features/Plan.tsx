import { Time } from 'src/components/Time'
import { useFormik } from 'formik'
import { ReactNode, useEffect, useMemo } from 'react'
import { FiMapPin, FiUsers, FiSave, FiArrowLeft, FiX, FiClock, FiTrash2 } from 'react-icons/fi'
import { Button } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { H4, H5, H6 } from 'src/components/Typography'
import { Icon, IconSide } from 'src/components/Icon'
import { CategoryInfo, usePlans, CATEGORY_INFO, CATEGORY } from 'src/eventfulLib/plan'
import { Eventful } from 'types'
import { TimeInput } from './TimeInput'
import { UserSelect } from './UserSelect'
import { Input } from 'src/components/Input'
import { Select } from 'src/components/Select'
import { useContacts } from 'src/eventfulLib/contact'
import { useSession } from 'src/eventfulLib/session'
import { Avatar, AvatarGroup } from 'src/components/Avatar'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/Popover'
import { useEvent } from 'src/eventfulLib/event'
import { CATEGORY_ICON } from 'src/libs/plan'
import tinycolor from 'tinycolor2'
import { InlineDialog } from 'src/components/Dialog/InlineDialog'
import { useMediaQuery } from 'src/libs/styled'

interface EmptyProps {
  info: CategoryInfo
  plan: Eventful.API.PlanGet
  onEdit: PlanProps['onEdit']
  children: ReactNode
}

const Empty = ({ plan, info, onEdit, children }: EmptyProps) => {
  const isEmpty = useMemo(
    () => !plan.what?.length && !plan.location?.address?.length && !plan.time,
    [plan]
  )

  return isEmpty ? (
    <H5
      clickable
      onClick={() => onEdit()}
      css={{
        fontStyle: 'italic',
      }}
    >
      {`Untitled ${info.label.toLowerCase()}`}
    </H5>
  ) : (
    <>{children}</>
  )
}

interface PlanProps {
  editing?: boolean
  plan: Eventful.API.PlanGet
  onEdit: () => void
  onClose: () => void
}

export const Plan = ({ editing, plan, onEdit, onClose }: PlanProps) => {
  const { updatePlan, deletePlan } = usePlans({ event: plan.event })
  const { handleChange, setFieldValue, resetForm, values, dirty, submitForm } =
    useFormik<Eventful.API.PlanEdit>({
      initialValues: {
        ...plan,
        who: plan.who?.map((user) => user._id),
      },
      enableReinitialize: true,
      onSubmit: (values) => {
        updatePlan({
          ...values,
          _id: plan._id,
        })
        onClose()
      },
    })
  const info = useMemo(() => CATEGORY_INFO[values.category ?? plan.category], [plan, values])
  const icon = useMemo(() => CATEGORY_ICON[values.category ?? plan.category], [plan, values])

  const { session } = useSession()
  const { data: contacts } = useContacts({ user: session?._id })
  const { data: event } = useEvent({ id: plan.event })

  const whoOptions = useMemo(
    () => [...(contacts ?? []), ...(session ? [session] : [])],
    [contacts, session]
  )
  const whoAll = useMemo(
    () => [...(contacts ?? []), ...(session ? [session] : []), ...(event?.who ?? [])],
    [contacts, session, event]
  )
  const whoFixed = useMemo(
    () =>
      whoAll
        .filter((user) => !whoOptions.some((user2) => user._id === user2._id))
        .map((user) => user._id),
    [whoAll, whoOptions]
  )
  const label = useMemo(
    () =>
      (plan.category === CATEGORY.Carpool
        ? `${plan.what} carpool`
        : plan.category === CATEGORY.Lodging || plan.category === CATEGORY.Meet
        ? plan.location?.label ?? plan.location?.address
        : !!plan.what?.length
        ? plan.what
        : ''
      )?.trim() ?? '',
    [plan]
  )
  const isSmall = useMediaQuery({ maxSize: 'Tablet' })

  return (
    <Flex
      column
      css={{
        padding: ' $small  $controlPadding',
        gap: '$small',
        border: '1px solid $controlBorder',
        borderRadius: '$control',
        boxShadow: plan.time ? '$card' : undefined,
        minHeight: 32,
        minWidth: isSmall ? 0 : 200,
        '& > .edit-button': {
          opacity: 0,
        },
        '&:hover > .edit-button': {
          opacity: 1,
        },
      }}
      data-testid="plan"
    >
      {editing && session ? (
        <InlineDialog open={editing} onOpenChange={() => onClose()}>
          <Flex
            column
            css={{
              gap: '$small',
            }}
          >
            {info.fields.what && (
              <IconSide icon={icon}>
                <Input
                  name="what"
                  small
                  value={values.what}
                  onChange={handleChange}
                  placeholder={info.placeholder.what}
                  variant="underline"
                />
              </IconSide>
            )}
            {info.fields.location && (
              <IconSide icon={FiMapPin} color="$red" subtle>
                <Input
                  name="location.address"
                  small
                  value={values.location?.address ?? ''}
                  placeholder={info.placeholder.location}
                  onChange={handleChange}
                  variant="underline"
                />
              </IconSide>
            )}
            {info.fields.time && (
              <TimeInput
                name="time"
                defaultValue={values.time}
                onChange={(v) => setFieldValue('time', v)}
                gap="$small"
                small
                square={25}
                variant="underline"
              />
            )}
            {info.fields.who && (
              <IconSide icon={FiUsers} subtle>
                <UserSelect
                  name="who"
                  users={whoAll}
                  options={whoOptions}
                  fixedUsers={whoFixed}
                  value={
                    values.who?.map(
                      (id) => whoAll.find((user2) => user2._id === id) as Eventful.User
                    ) ?? []
                  }
                  onChange={(users) =>
                    setFieldValue(
                      'who',
                      users.map((user) => user._id)
                    )
                  }
                />
              </IconSide>
            )}
            <Flex css={{ justifyContent: 'space-between' }}>
              <Flex css={{ gap: '$small' }}>
                <Button
                  onClick={() => (dirty ? submitForm() : onClose())}
                  variant={dirty ? 'filled' : 'ghost'}
                  color={dirty ? 'success' : undefined}
                  title="Save plan"
                  square
                >
                  {dirty ? <FiSave /> : <FiArrowLeft />}
                </Button>
                {dirty && (
                  <Button
                    onClick={() => {
                      resetForm()
                      onClose()
                    }}
                    variant="ghost"
                    square
                  >
                    <FiX />
                  </Button>
                )}
                {plan.createdBy === session._id && (
                  <Button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this plan?')) {
                        deletePlan(plan._id)
                        onClose()
                      }
                    }}
                    variant="ghost"
                    square
                  >
                    <FiTrash2 />
                  </Button>
                )}
              </Flex>
              <Select
                defaultValue={{
                  value: values.category ?? 0,
                  label: CATEGORY_INFO[values.category ?? 0].label,
                }}
                onChange={(v) => setFieldValue('category', v?.value ?? 0)}
                options={Object.entries(CATEGORY_INFO).map(([key, cat]) => ({
                  value: parseInt(key),
                  label: cat.label,
                }))}
                menuPortalTarget={document.body}
              />
            </Flex>
          </Flex>
        </InlineDialog>
      ) : (
        <Empty plan={plan} info={info} onEdit={onEdit}>
          <Flex css={{ gap: '$small' }}>
            {plan.category !== CATEGORY.None && (
              <Icon
                icon={icon}
                size={25}
                color={tinycolor(info.color).setAlpha(0.5).toHexString()}
                css={{
                  filter: `drop-shadow(2px 2px 0px ${tinycolor(info.color)
                    .lighten(30)
                    .toHexString()})`,
                }}
              />
            )}
            <Flex column css={{ gap: 0 }}>
              <Flex css={{ justifyContent: 'space-between', alignItems: 'center' }}>
                {(info.fields.what ||
                  plan.category === CATEGORY.Lodging ||
                  plan.category === CATEGORY.Meet) && (
                  <H4
                    clickable
                    onClick={() => onEdit()}
                    css={{
                      flex: 1,
                      fontStyle: !!label?.length ? 'normal' : 'italic',
                      color: !!label?.length ? '$black' : '$disabled',
                      fontWeight: 500,
                    }}
                  >
                    {!!label?.length ? label : 'Untitled plan'}
                  </H4>
                )}
                {info.fields.who && (
                  <Flex flex="0">
                    {!!plan.who?.length && (
                      <Popover>
                        <PopoverTrigger clickable>
                          <AvatarGroup
                            avatars={plan.who.map((user) => ({
                              username: user.username,
                            }))}
                          />
                        </PopoverTrigger>
                        <PopoverContent>
                          <Flex column css={{ gap: '$small' }}>
                            <H5>{`Participants (${plan.who.length})`}</H5>
                            <Flex css={{ flexWrap: 'wrap', overflow: 'auto', gap: 7 }}>
                              {plan.who.map((user) => (
                                <Avatar
                                  key={user._id.toString()}
                                  username={user.username}
                                  size="medium"
                                  to={`/u/${user.username}`}
                                />
                              ))}
                            </Flex>
                          </Flex>
                        </PopoverContent>
                      </Popover>
                    )}
                  </Flex>
                )}
              </Flex>
              {((plan.location && plan.location.address !== label) || plan.time) && (
                <Flex css={{ justifyContent: 'space-between' }}>
                  {info.fields.location && plan.location && plan.location.address !== label ? (
                    <H6>{plan.location.address}</H6>
                  ) : (
                    <Flex />
                  )}
                  {info.fields.time && plan.time && (
                    <Time time={plan.time} css={{ justifyContent: 'flex-end' }} />
                  )}
                </Flex>
              )}
            </Flex>
          </Flex>
        </Empty>
      )}
    </Flex>
  )
}
