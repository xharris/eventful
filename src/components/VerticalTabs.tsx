import * as Tabs from '@radix-ui/react-tabs'
import { ComponentProps } from '@stitches/react'
import { styled } from 'src/libs/styled'

const StyledRoot = styled(Tabs.Root, {
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  gap: '$small',
})

export const List = styled(Tabs.List, {
  display: 'flex',
  flexDirection: 'column',
  padding: '$small',
})

export const Trigger = styled(Tabs.Trigger, {
  border: 'none',
  background: 'transparent',
  padding: 0,
})

export const Content = styled(Tabs.Content, {
  flex: 1,
})

export const Separator = styled('hr', {
  borderColor: 'transparent',
  borderLeftColor: 'rgba(0,0,0,0.2)',
})

export const Root = (props: ComponentProps<typeof StyledRoot>) => {
  // TODO make this controlled and add forceMount and a context for styling Triggers?
  return <StyledRoot {...props} orientation="vertical" />
}
