import { ComponentProps } from '@stitches/react'
import { useCallback, useState } from 'react'
import { FiChevronDown, FiChevronUp, FiSunrise, FiSunset } from 'react-icons/fi'
import { Checkbox } from 'src/components/Checkbox'
import { DateTimeInput, DateTimeInputProps } from 'src/components/DateTimeInput'
import { Flex } from 'src/components/Flex'
import { IconSide } from 'src/components/Icon'
import { Input } from 'src/components/Input'
import { Eventful } from 'types'

interface TimeInput extends Omit<ComponentProps<typeof Input>, 'defaultValue' | 'onChange'> {
  defaultValue?: Eventful.Time
  onChange?: (v: Eventful.Time | null) => void
  small?: boolean
  gap?: string | number
  square?: number | string | true
  inputProps?: DateTimeInputProps['inputProps']
}

export const TimeInput = ({
  name,
  defaultValue,
  onChange,
  small,
  gap,
  square,
  css,
  inputProps,
  ...props
}: TimeInput) => {
  const [value, setValue] = useState(defaultValue)
  const [end, setEnd] = useState<Eventful.TimePart | undefined>(defaultValue?.end)
  const [hasEnd, setHasEnd] = useState(!!defaultValue?.end)

  const update = useCallback(
    (v: Partial<Eventful.Time> = {}) => {
      let newValue: Eventful.Time = { ...value, ...v }
      setValue((prev) => ({
        ...prev,
        ...v,
      }))
      if (v.end) {
        setEnd(v.end)
      }
      if (onChange) {
        onChange(newValue.start || newValue.end ? newValue : null)
      }
    },
    [onChange, value]
  )

  return (
    <Flex css={{ gap }}>
      <Flex column css={{ gap }}>
        <IconSide css={{ gap }} icon={FiSunrise} subtle>
          <DateTimeInput
            {...props}
            css={{ ...css, flex: 1, padding: small ? 0 : undefined }}
            name={`${name}.start`}
            defaultValue={value?.start}
            onChange={(v) => update({ start: v ?? undefined })}
            inputProps={{
              max: value?.end?.toString(),
              small,
              ...inputProps,
            }}
          />
        </IconSide>
        {hasEnd && (
          <IconSide css={{ gap }} icon={FiSunset} subtle>
            <DateTimeInput
              {...props}
              css={{ ...css, flex: 1, padding: small ? 0 : undefined }}
              name={`${name}.end`}
              defaultValue={end}
              onChange={(v) => update({ end: v ?? undefined })}
              inputProps={{
                min: value?.start?.toString(),
                small,
                ...inputProps,
              }}
            />
          </IconSide>
        )}
      </Flex>
      <Checkbox
        icon={{
          true: FiChevronUp,
          false: FiChevronDown,
        }}
        name={`${name}.allday`}
        checked={hasEnd}
        onChange={(e) => {
          update({ end: hasEnd ? undefined : end })
          setHasEnd(!hasEnd)
        }}
        square={square}
      />
    </Flex>
  )
}
