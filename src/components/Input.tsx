import { Field } from 'formik'
import { HTMLProps } from 'react'
import { styled } from 'src/features/styled'

export const Input = styled('input', {
  padding: '$controlPadding',
  fontSize: '$control',
  borderRadius: '$control',
  borderColor: '$controlBorder',
  borderWidth: 1,
  borderStyle: 'solid',
  variants: {
    variant: {
      filled: {
        backgroundColor: '$inputBackground',
        border: 'none',
      },
    },
  },
})
