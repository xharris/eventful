import { styled, css } from 'src/libs/styled'

const style = css({
  margin: 0,
  transition: 'all ease-in-out 0.2s',
  textDecorationLine: 'underline',
  textDecorationColor: 'transparent',
  fontWeight: 100,
  variants: {
    clickable: {
      true: {
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
  },
})

export const H1 = styled('h1', {
  ...style,
  fontSize: '$1',
})
export const H2 = styled('h2', {
  ...style,
  fontSize: '$2',
})
export const H3 = styled('h3', {
  ...style,
  fontSize: '$3',
})
export const H4 = styled('h4', {
  ...style,
  fontSize: '$4',
})
export const H5 = styled('h5', {
  ...style,
  fontSize: '$5',
})
export const H6 = styled('h6', {
  ...style,
  fontSize: '$6',
})
