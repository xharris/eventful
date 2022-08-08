import { styled } from 'src/features/styled'

export const Flex = styled('div', {
  display: 'flex',
  flex: 1,
  gap: '$root',
  boxSizing: 'border-box',
  variants: {
    fill: {
      true: {
        width: '100%',
        height: '100%',
      },
    },
    row: {
      true: {
        flexDirection: 'row',
      },
      reverse: {
        flexDirection: 'row-reverse',
      },
    },
    column: {
      true: {
        flexDirection: 'column',
      },
      reverse: {
        flexDirection: 'column-reverse',
      },
    },
    flex: {
      0: {
        flex: 0,
      },
      1: {
        flex: 1,
      },
    },
  },
})

export const HStack = styled(Flex, {
  flexGrow: 0,
  flexDirection: 'row',
  variants: {
    reverse: {
      true: {
        flexDirection: 'row-reverse',
      },
    },
  },
})

export const VStack = styled(Flex, {
  flexGrow: 0,
  flexDirection: 'column',
  variants: {
    reverse: {
      true: {
        flexDirection: 'column-reverse',
      },
    },
  },
})
