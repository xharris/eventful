import { createStitches } from '@stitches/react'

export const { styled, css } = createStitches({
  utils: {
    w: (v: number | string) => ({ width: v }),
    h: (v: number | string) => ({ height: v }),
  },
  theme: {
    space: {
      1: '1rem',
      root: '$1',
      controlPadding: '0.5rem',
    },
    radii: {
      control: '3px',
    },
    borderStyles: {
      control: 'solid',
    },
    fontSizes: {
      1: '5rem',
      2: '4.2rem',
      3: '3.6rem',
      4: '3rem',
      5: '2.4rem',
      6: '1.5rem',
      control: '0.8rem',
    },
    colors: {
      black: '#212121',
      disabled: '#BDBDBD',
      controlBorder: '#616161',
      controlBackground: '#E0E0E0',
      inputBackground: '#EEEEEE',
    },
  },
})
