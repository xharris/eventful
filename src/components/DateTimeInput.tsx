import { ComponentProps } from '@stitches/react'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { styled } from 'src/libs/styled'
import { Eventful } from 'types'
import { Flex } from './Flex'
import { Input, InputStyle } from './Input'

const Wrapper = styled(Flex, {
  ...InputStyle,
  padding: 0,
})

export interface DateTimeInputProps
  extends Omit<ComponentProps<typeof Wrapper>, 'defaultValue' | 'onChange'> {
  name: string
  defaultValue?: Eventful.TimePart
  onChange: (v: Eventful.TimePart | null) => void
  inputProps?: Omit<ComponentProps<typeof Input>, 'defaultValue' | 'onChange'>
}

export const DateTimeInput = ({
  name,
  defaultValue,
  onChange,
  inputProps,
  css,
  ...props
}: DateTimeInputProps) => {
  const [date, setDate] = useState<string | null>(
    defaultValue ? moment(defaultValue?.date).format('YYYY-MM-DD') : null
  )
  const [time, setTime] = useState<string | null>(
    defaultValue ? moment(defaultValue?.date).format('HH:mm') : null
  )
  const [allday, setAllday] = useState(defaultValue?.allday)

  const changed = useCallback(
    (_date: string | null, _time: string | null) => {
      if (onChange) {
        setAllday(!_time)
        onChange(
          _date
            ? {
                date: moment([_date, _time ?? ''].join(' '), 'YYYY-MM-DD HH:mm').toDate(),
                allday: !_time,
              }
            : null
        )
      }
    },
    [onChange]
  )

  return (
    <Wrapper {...props} css={{ ...css, gap: 0 }}>
      <Flex css={{ gap: 0, alignItems: 'center' }}>
        <Input
          variant="unstyled"
          type="date"
          value={date ?? ''}
          onChange={(e) => {
            const newDate = e.target.value.length ? e.target.value : null
            setDate(newDate)
            changed(newDate, time)
          }}
          {...inputProps}
        />
      </Flex>
      <Flex css={{ gap: 0, alignItems: 'center' }}>
        <Input
          variant="unstyled"
          type="time"
          value={time && !allday ? time : ''}
          onChange={(e) => {
            const newTime = e.target.value.length ? e.target.value : null
            setTime(newTime)
            changed(date, newTime)
          }}
          {...inputProps}
        />
      </Flex>
    </Wrapper>
  )
}
