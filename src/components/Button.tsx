import { ComponentProps } from '@stitches/react'
import { HTMLProps } from 'react'
import { FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { styled } from 'src/libs/styled'
import { Flex } from './Flex'

const CHILD_N_ICON = '&, & > *:not(svg)'

export const Component = styled('button', {
  cursor: 'pointer',
  padding: '$controlPadding',
  color: '$controlFg',
  backgroundColor: '$controlBackground',
  borderColor: 'transparent',
  borderRadius: '$control',
  borderStyle: 'solid',
  borderWidth: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '> svg': {
    fontSize: '1rem',
  },
  [CHILD_N_ICON]: {
    transition: 'all ease-in-out 0.1s',
  },
  variants: {
    color: {
      success: {
        color: '$successFg',
        backgroundColor: '$successBg',
      },
    },
    variant: {
      ghost: {
        [CHILD_N_ICON]: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          '&:hover:not(:disabled)': {
            [CHILD_N_ICON]: {
              backgroundColor: '$controlBackground',
            },
          },
        },
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: '$controlBackground',
        '&:hover:not(:disabled)': {
          [CHILD_N_ICON]: {
            backgroundColor: '$controlBackground',
          },
        },
      },
      filled: {
        [CHILD_N_ICON]: {
          backgroundColor: '$controlBackground',
          borderColor: 'transparent',
        },
      },
    },
    rounded: {
      true: {
        borderRadius: '100%',
      },
    },
  },
})

interface ButtonProps extends ComponentProps<typeof Component> {
  square?: number | string | true
}

export const Button = ({ square, css, ...props }: ButtonProps) => (
  <Component
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
      ...css,
    }}
    {...props}
  />
)

interface LinkButtonProps extends ButtonProps {
  to: string
}

export const LinkButton = ({ to, ...props }: LinkButtonProps) => (
  <Link to={to}>
    <Button {...props} />
  </Link>
)

export const AddButton = ({ css, children, square, ...props }: ButtonProps) => (
  <Button
    css={{
      ...css,
      position: 'relative',
    }}
    square={square}
    {...props}
  >
    {children}
    <Flex
      className="add-icon"
      css={{
        position: 'absolute',
        right: -5,
        bottom: -5,
        borderRadius: '100%',
        background: '$controlBackground',
        color: '#616161',
      }}
    >
      <FiPlus />
    </Flex>
  </Button>
)
