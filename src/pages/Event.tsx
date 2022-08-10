import { useParams } from 'react-router-dom'
import { AddButton, Button } from 'src/components/Button'
import { Flex, HStack } from 'src/components/Flex'
import { H1, H2, H3, H4, H5, H6 } from 'src/components/Header'
import { Input } from 'src/components/Input'
import { useEvent } from 'src/libs/event'
import { useSession } from 'src/libs/session'
import {
  FiFile,
  FiMapPin,
  FiClock,
  FiUsers,
  FiSave,
  FiX,
  FiEdit2,
  FiArrowLeft,
} from 'react-icons/fi'
import { CATEGORY, CategoryInfo, CATEGORY_INFO, usePlans } from 'src/libs/plan'
import { Agenda } from 'src/features/Agenda'
import { Eventful } from 'types'
import { useFormik } from 'formik'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Select } from 'src/components/Select'
import { TimeInput } from 'src/features/TimeInput'
import { IconSide } from 'src/components/Icon'
import { Time } from 'src/components/Time'

interface EmptyProps {
  info: CategoryInfo
  plan: Eventful.API.PlanGet
  onEdit: PlanProps['onEdit']
  children: ReactNode
}

const Empty = ({ plan, info, onEdit, children }: EmptyProps) => {
  const isEmpty = useMemo(
    () => !plan.what?.length && !plan.location?.address?.length && !plan.time && !plan.who?.length,
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

const Plan = ({ editing, plan, onEdit, onClose }: PlanProps) => {
  const { updatePlan } = usePlans({ event: plan.event.toString() })
  const { handleChange, setFieldValue, resetForm, values, dirty, submitForm } = useFormik({
    initialValues: plan,
    onSubmit: (values) => {
      updatePlan({
        ...values,
        _id: plan._id,
      })
      onClose()
    },
  })
  const info = useMemo(() => CATEGORY_INFO[values.category ?? plan.category], [plan, values])

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
      {editing ? (
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
            <IconSide css={{ gap: '$small' }} icon={FiMapPin} subtle>
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
          {info.fields.what && (
            <H4
              clickable
              onClick={() => onEdit()}
              css={{
                fontStyle: !!plan.what?.length ? 'normal' : 'italic',
                color: !!plan.what?.length ? '$black' : '$disabled',
              }}
            >
              {plan.what}
            </H4>
          )}
          {info.fields.location && plan.location && (
            <IconSide icon={FiMapPin} color="#F44336" css={{ opacity: 0.5 }}>
              <H5>{plan.location.address}</H5>
            </IconSide>
          )}
          {info.fields.time && plan.time && (
            <Flex css={{ gap: '$small', alignItems: 'center' }}>
              <FiClock />
              <Time time={plan.time} />
            </Flex>
          )}
        </Empty>
      )}
    </Flex>
  )
}

export const Event = () => {
  const { eventId } = useParams()
  const { data: event } = useEvent({ id: eventId })
  const { session } = useSession()
  const { addPlan } = usePlans({ event: eventId })
  const [editing, setEditing] = useState<Eventful.ID>()

  return (
    <Flex column fill css={{ alignItems: 'stretch' }}>
      <Flex column flex="0" css={{ alignItems: 'flex-start' }}>
        {session?._id.toString() === event?.createdBy?.toString() ? (
          <Input
            name="name"
            defaultValue={event?.name}
            onChange={(e) => console.log(e.target.value)}
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
                    {cat.icon}
                    {cat.label}
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
