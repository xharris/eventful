import { ComponentProps } from '@stitches/react'
import { HTMLProps, useEffect, useState } from 'react'
import { styled } from 'src/libs/styled'
import { Flex } from './Flex'
import { FiCheckSquare, FiSquare } from 'react-icons/fi'
import { Icon } from './Icon'
import { IconType } from 'react-icons'

const Label = styled('label', {
  cursor: 'pointer',
  padding: '$controlPadding',
  display: 'flex',
  flex: 0,
  fontSize: '$control',
  gap: '0.5rem',
  borderRadius: '$control',
  borderColor: 'transparent',
  borderWidth: 1,
  borderStyle: 'solid',
  alignSelf: 'flex-start',
  transition: 'all ease-in-out 0.2s',
  '& > input': {
    margin: 0,
  },
  '&, & > *': {
    userSelect: 'none',
  },
  '& > span': {
    lineHeight: '14px',
    whiteSpace: 'nowrap',
  },
  variants: {
    variant: {
      ghost: {
        '&:hover, &:focus': {
          backgroundColor: '$inputBackground',
        },
      },
      outlined: {
        borderColor: '$controlBorder',
      },
    },
    small: {
      true: {
        padding: '$small',
      },
    },
  },
})

interface Props extends HTMLProps<HTMLInputElement> {
  label?: string
  icon?: { true: IconType; false: IconType }
  square?: number | string | true
  variant?: ComponentProps<typeof Label>['variant']
  small?: ComponentProps<typeof Label>['small']
}

const Component = ({
  label,
  icon = { true: FiCheckSquare, false: FiSquare },
  checked = false,
  onChange,
  square,
  variant = 'ghost',
  small,
  defaultChecked,
  ...props
}: Props) => {
  const [value, setValue] = useState(checked)

  useEffect(() => {
    if (defaultChecked != null) {
      setValue(defaultChecked)
    }
  }, [defaultChecked])

  return (
    <Label
      className="checkbox"
      css={{ padding: square ? 0 : '$controlPadding' }}
      variant={variant}
      small={small}
    >
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
          <Icon size={16} icon={value ? icon.true : icon.false} subtle />
        </Flex>
      )}
      {label && <span>{label}</span>}
    </Label>
  )
}

export const Checkbox = styled(Component, {})
