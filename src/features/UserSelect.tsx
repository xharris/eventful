import { ComponentProps, useEffect, useMemo, useState } from 'react'
import { MultiValue } from 'react-select'
import { Select } from 'src/components/Select'
import { Eventful } from 'types'

const noRepeats = <I extends {} = { _id: Eventful.ID },>(items: I[], key?: keyof I) =>
    items.reduce((arr, item) => 
    arr.some(item2 => item2[key ?? '_id' as keyof I] === item[key ?? '_id' as keyof I])
      ? arr 
      : [...arr, item]
  , [] as I[])

type Item = {
  value: Eventful.ID
  label: string
  isFixed?: boolean
}

interface UserSelectProps extends Omit<ComponentProps<typeof Select<Item, true>>, 'options' | 'onChange' | 'value' | 'defaultValue'> {
  name: string
  /** all potential users */
  users: Eventful.User[]
  /** users that show in options */
  options?: Eventful.User[]
  value?: Eventful.User[]
  defaultValue?: Eventful.User[]
  onChange: (ids: Eventful.User[]) => void
  fixedUsers?: Eventful.ID[]
}

export const UserSelect = ({
  name,
  users: _users,
  options: _options,
  value: _value,
  defaultValue = [],
  onChange,
  fixedUsers,
  ...props
}: UserSelectProps) => {
  const [selected, setSelected] = useState<MultiValue<Item>>(
    defaultValue.map((user) => ({
      value: user._id,
      label: user.username,
    }))
  )

  const users = useMemo(() => 
    noRepeats(_users)
  , [_users])

  const options: Item[] = useMemo(() => 
    noRepeats([
      ...users,
      ..._options ?? []
    ]).map((user) => ({
      value: user._id,
      label: user.username,
      isFixed: !fixedUsers?.includes(user._id)
    }))
  , [users, _options, fixedUsers])


  const fixedItems: Item[] = useMemo(() => 
    users
    .filter(user => fixedUsers?.includes(user._id) && _value?.some(user2 => user2._id === user._id))
    .map(user => ({
      value: user._id,
      label: user.username,
      isFixed: fixedUsers?.includes(user._id)
    }))
  , [users, fixedUsers, _value])

  const value = useMemo(
    () => 
      noRepeats<Item>([
        ...fixedItems,
        ..._value?.map((user) => ({
          value: user._id,
          label: user.username,
          isFixed: fixedUsers?.includes(user._id)
        })) ?? selected
      ], 'value')
      , [_value, selected, fixedUsers]
  )

  return (
    <Select<Item, true>
      {...props}
      name={name}
      isMulti
      value={
        value
      }
      options={options}
      onChange={(newItems) => {
        const items = [
          ...fixedItems,
          ...newItems,
        ]
        setSelected(items)
        onChange(users.filter((user) => items.find((item) => item.value === user._id)))
      }}
      placeholder="Select who..."
      menuPortalTarget={document.body}
    />
  )
}
