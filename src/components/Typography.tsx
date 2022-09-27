import { styled, css } from 'src/libs/styled'

const style = {
  margin: 0,
  transition: 'all ease-in-out 0.2s',
  textDecorationLine: 'underline',
  textDecorationColor: 'transparent',
  variants: {
    clickable: {
      true: {
        textDecorationColor: '$disabled',
        '&:hover': {
          textDecorationColor: '$black',
          cursor: 'pointer',
        },
      },
    },
    subtle: {
      true: {
        fontStyle: 'italic',
        opacity: 0.75,
      },
    },
    bold: {
      true: {
        fontWeight: 600,
      },
    },
    underline: {
      true: {
        textDecorationColor: '$black',
      },
    },
  },
}

export const H1 = styled('h1', {
  ...style,
})
export const H2 = styled('h2', {
  ...style,
})
export const H3 = styled('h3', {
  ...style,
})
export const H4 = styled('h4', {
  ...style,
})
export const H5 = styled('h5', {
  ...style,
})
export const H6 = styled('h6', {
  ...style,
})
