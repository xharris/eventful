import { ComponentProps } from '@stitches/react'
import { HTMLProps } from 'react'
import { styled } from 'src/features/styled'

export const Component = styled('button', {
  cursor: 'pointer',
  padding: '$controlPadding',
  backgroundColor: '$controlBackground',
  border: 'none',
  borderRadius: '$control',
  transition: 'all ease-in-out 0.1s',
  variants: {
    variant: {
      ghost: {
        backgroundColor: 'transparent',
        border: 'none',
        '&:hover:not(:disabled)': {
          backgroundColor: '$controlBackground',
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
  <a href={to}>
    <Button {...props} />
  </a>
)
