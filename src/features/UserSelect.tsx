import { ComponentProps, useEffect, useState } from 'react'
import { MultiValue } from 'react-select'
import { Select } from 'src/components/Select'
import { Eventful } from 'types'

type Item = {
  value: Eventful.ID
  label: string
}

interface UserSelectProps {
  name: string
  users: Eventful.User[]
  value?: Eventful.User[]
  defaultValue?: Eventful.User[]
  onChange: (ids: Eventful.User[]) => void
}

export const UserSelect = ({
  name,
  users,
  value,
  defaultValue = [],
  onChange,
}: UserSelectProps) => {
  const [selected, setSelected] = useState<MultiValue<Item>>(
    defaultValue.map((user) => ({
      value: user._id,
      label: user.username,
    }))
  )

  return (
    <Select<Item, true>
      name={name}
      isMulti
      value={
        value?.map((user) => ({
          value: user._id,
          label: user.username,
        })) ?? selected
      }
      options={users.map((user) => ({
        value: user._id,
        label: user.username,
      }))}
      onChange={(items) => {
        setSelected(items)
        onChange(users.filter((user) => items.find((item) => item.value === user._id)))
      }}
      placeholder="Select who..."
      menuPortalTarget={document.body}
    />
  )
}
