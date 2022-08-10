import { HTMLProps, useState } from 'react'
import { styled } from 'src/libs/styled'
import { Flex } from './Flex'

const Label = styled('label', {
  cursor: 'pointer',
  padding: '$controlPadding',
  display: 'flex',
  fontSize: '$control',
  gap: '0.5rem',
  userSelect: 'none',
})

interface Props extends HTMLProps<HTMLInputElement> {
  label?: string
  icon?: JSX.Element | { true: JSX.Element; false: JSX.Element }
  square?: number | string | true
}

const Component = ({ label, icon, checked, onChange, square, ...props }: Props) => {
  const [value, setValue] = useState(checked)

  return (
    <Label css={{ padding: square ? 0 : 'initial' }}>
      <input
        {...props}
        type="checkbox"
        hidden={!!icon}
        checked={value}
        onChange={(e) => {
          setValue(e.target.checked)
          if (onChange) {
            onChange(e)
          }
        }}
      />
      {icon && (
        <Flex
          css={{
            width: square === true ? 32 : square,
            height: square === true ? 32 : square,
            ...(square
              ? {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }
              : {}),
          }}
        >
          {typeof icon === 'object' && !('true' in icon)
            ? icon
            : icon && 'true' in icon
            ? value
              ? icon.true
              : icon.false
            : icon}
        </Flex>
      )}
      {label && <span>{label}</span>}
    </Label>
  )
}

export const Checkbox = styled(Component, {})
