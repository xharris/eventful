import { ComponentProps } from '@stitches/react'
import { styled } from 'src/libs/styled'

export const Chip = styled('button', {
  padding: '$controlPadding',
  border: 'none',
  backgroundColor: '$controlBackground',
  display: 'flex',
  alignItems: 'center',
  gap: '$small',
  borderRadius: 40,
  height: 24,
  variants: {
    selected: {
      true: {
        background: '$disabled',
      },
      false: {
        background: '$inputBackground',
      },
    },
    clickable: {
      true: {
        cursor: 'pointer',
      },
    },
  },
})
