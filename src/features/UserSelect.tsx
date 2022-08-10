import { useState } from 'react'
import { MultiValue } from 'react-select'
import { Select } from 'src/components/Select'
import { Eventful } from 'types'

type Item = {
  value: Eventful.User
  label: string
}

interface UserSelectProps {
  name: string
  users: Item[]
  defaultValue: Eventful.User[]
  onChange: (ids: Eventful.User[]) => void
}

export const UserSelect = ({ name, users, defaultValue, onChange }: UserSelectProps) => {
  const [selected, setSelected] = useState<Item[]>(
    defaultValue.map((usr) => ({
      value: usr,
      label: usr.username,
    }))
  )

  return (
    <Select<Item[], true>
      name={name}
      isMulti
      defaultValue={selected}
      options={users.map((user) => ({
        value: user,
        label: user.username,
      }))}
      onChange={(v) => {
        setSelected(v)
        onChange(Array.from(v).map((sel) => sel.value))
      }}
    />
  )
}
