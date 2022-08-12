import { ComponentProps } from '@stitches/react'
import React, { forwardRef, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import reactTextareaAutosize from 'react-textarea-autosize'
import { css, styled } from 'src/libs/styled'

export const InputStyle = css({
  flex: 1,
  padding: '$controlPadding',
  fontSize: '$control',
  borderRadius: '$control',
  borderColor: '$controlBorder',
  borderWidth: 1,
  borderStyle: 'solid',
  transition: 'all ease-in-out 0.2s',
  variants: {
    variant: {
      filled: {
        backgroundColor: '$inputBackground',
        border: 'none',
      },
      underline: {
        backgroundColor: '$background',
        border: 'none',
        borderBottom: '1px solid $controlBorder',
        borderRadius: '0',
        '&:hover,&:focus': {
          backgroundColor: '$inputBackground',
          borderRadius: '$control',
        },
      },
      unstyled: {
        backgroundColor: 'transparent',
        border: 'none',
      },
    },
    small: {
      true: {
        padding: '0.25rem',
      },
    },
  },
})

export const Input = styled('input', InputStyle)
export const TextArea = styled(reactTextareaAutosize, InputStyle)
