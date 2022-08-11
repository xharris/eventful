import { ComponentProps, useEffect, useMemo, useState } from 'react'
import { MultiValue } from 'react-select'
import { Select } from 'src/components/Select'
import { Eventful } from 'types'

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
  users,
  options: _options,
  value,
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

  const options: Item[] = useMemo(() => 
    users.filter(user => 
      !_options || _options.some(user2 => user2._id === user._id)  
    ).map((user) => ({
      value: user._id,
      label: user.username,
      isFixed: !fixedUsers?.includes(user._id)
    }))
  , [users, _options, fixedUsers])

  const fixedItems: Item[] = useMemo(() => 
    users
    .filter(user => fixedUsers?.includes(user._id) && value?.some(user2 => user2._id === user._id))
    .map(user => ({
      value: user._id,
      label: user.username,
      isFixed: fixedUsers?.includes(user._id)
    }))
  , [users, fixedUsers, value])

  return (
    <Select<Item, true>
      {...props}
      name={name}
      isMulti
      value={
        [
          ...fixedItems,
          ...value?.filter(user => !fixedItems.some(user2 => user2.value === user._id))
          .map((user) => ({
            value: user._id,
            label: user.username,
            isFixed: fixedUsers?.includes(user._id)
          })) ?? selected
        ]
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
