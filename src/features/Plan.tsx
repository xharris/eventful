import { Time } from 'src/components/Time'
import { useFormik } from 'formik'
import { ReactNode, useEffect, useMemo } from 'react'
import { FiMapPin, FiUsers, FiSave, FiArrowLeft, FiX, FiClock } from 'react-icons/fi'
import { Button } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { H4, H5 } from 'src/components/Header'
import { IconSide } from 'src/components/Icon'
import { CategoryInfo, usePlans, CATEGORY_INFO, CATEGORY } from 'src/libs/plan'
import { Eventful } from 'types'
import { TimeInput } from './TimeInput'
import { UserSelect } from './UserSelect'
import { Input } from 'src/components/Input'
import { Select } from 'src/components/Select'
import { useContacts } from 'src/libs/contact'
import { useSession } from 'src/libs/session'
import { Avatar, AvatarGroup } from 'src/components/Avatar'

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
    <H4
      clickable
      onClick={() => onEdit()}
      css={{
        fontStyle: 'italic',
        color: '$disabled',
        '&:hover': {
          textDecorationColor: '$disabled',
        },
      }}
    >
      {`${info.label} plan...`}
    </H4>
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
  const { updatePlan } = usePlans({ event: plan.event.toString() })
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
  const { session } = useSession()
  const { data: contacts } = useContacts({ user: session?._id })

  return (
    <Flex
      column
      css={{
        padding: '$controlPadding',
        gap: '$small',
        border: '1px solid $controlBorder',
        borderRadius: '$control',
        boxShadow: '$card',
        '& > .edit-button': {
          opacity: 0,
        },
        '&:hover > .edit-button': {
          opacity: 1,
        },
      }}
    >
      {editing && session ? (
        <>
          {info.fields.what && (
            <Input
              name="what"
              small
              value={values.what}
              onChange={handleChange}
              placeholder={info.placeholder.what}
              variant="underline"
            />
          )}
          {info.fields.location && (
            <IconSide icon={FiMapPin} color="$red" subtle>
              <Input
                name="location.address"
                small
                value={values.location?.address}
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
                users={[...(contacts ?? []), session]}
                value={[...(contacts ?? []), session].filter((user) =>
                  values.who?.find((user2) => user._id === user2)
                )}
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
        </>
      ) : (
        <Empty plan={plan} info={info} onEdit={onEdit}>
          <Flex>
            <IconSide icon={plan.category !== CATEGORY.None ? info.icon : undefined}>
              {info.fields.what && (
                <H4
                  clickable
                  onClick={() => onEdit()}
                  css={{
                    flex: 1,
                    fontStyle: !!plan.what?.length ? 'normal' : 'italic',
                    color: !!plan.what?.length ? '$black' : '$disabled',
                  }}
                >
                  {plan.what}
                </H4>
              )}
            </IconSide>
            {info.fields.who && (
              <Flex flex="0">
                <AvatarGroup avatars={plan.who} />
              </Flex>
            )}
          </Flex>
          {info.fields.location && plan.location && (
            <IconSide icon={FiMapPin} color="$red" subtle>
              <H5>{plan.location.address}</H5>
            </IconSide>
          )}
          {info.fields.time && plan.time && (
            <IconSide icon={FiClock} subtle>
              <Time time={plan.time} />
            </IconSide>
          )}
        </Empty>
      )}
    </Flex>
  )
}
