import { createStitches, globalCss } from '@stitches/react'

export const globalStyles = globalCss({
  // '*': {
  //   color: '#212121',
  // },
  a: {
    textDecoration: 'none',
  },
  '.rs__menu-portal': {
    zIndex: '100 !important',
  },
})

export const { styled, css, config } = createStitches({
  utils: {
    w: (v: number | string) => ({ width: v }),
    h: (v: number | string) => ({ height: v }),
  },
  media: {
    mobile: '(min-width: 400px)',
    phablet: '(min-width: 550px)',
    tablet: '(min-width: 750px)',
    desktop: '(min-width: 1000px)',
    desktopHD: '(min-width: 1200px)',
  },
  theme: {
    space: {
      1: '1rem',
      root: '$1',
      small: '0.3rem',
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
      small: '0.7rem',
    },
    colors: {
      background: 'white',
      black: '#212121',
      disabled: '#BDBDBD',
      controlFg: '#212121',
      controlBorder: '#9E9E9E', // '#9E9E9E',
      controlBackground: '#E0E0E0',
      inputBackground: '#EEEEEE',
      successFg: '#1B5E20',
      successBg: '#A5D6A7',
      red: '#F44336',
    },
    shadows: {
      text: '-1px 0px 2px white, 1px 0px 2px white, 0px -1px 2px white, 0px 1px 2px white',
      card: '2px 2px 0px 0px #BDBDBD', //'0 0 3px 0px #BDBDBD',
    },
  },
})
