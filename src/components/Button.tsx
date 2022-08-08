import { ComponentProps } from '@stitches/react'
import { HTMLProps } from 'react'
import { Link } from 'react-router-dom'
import { styled } from 'src/features/styled'

export const Component = styled('button', {
  cursor: 'pointer',
  padding: '$controlPadding',
  backgroundColor: '$controlBackground',
  borderColor: 'transparent',
  borderRadius: '$control',
  borderStyle: 'solid',
  borderWidth: 1,
  transition: 'all ease-in-out 0.1s',
  variants: {
    variant: {
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        '&:hover:not(:disabled)': {
          backgroundColor: '$controlBackground',
        },
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: '$controlBackground',
        '&:hover:not(:disabled)': {
          backgroundColor: '$controlBackground',
        },
      },
      filled: {
        backgroundColor: '$controlBackground',
        borderColor: 'transparent',
        '&:hover:not(:disabled)': {
          backgroundColor: 'transparent',
          borderColor: '$controlBackground',
        },
      },
    },
  },
})

interface ButtonProps extends ComponentProps<typeof Component> {
  square?: number | string
}

export const Button = ({ square, css, ...props }: ButtonProps) => (
  <Component
    css={{
      width: square,
      height: square,
      ...(square
        ? {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
