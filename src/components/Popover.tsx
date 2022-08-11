import * as RPopover from '@radix-ui/react-popover'
import { ReactNode } from 'react'
import { FiX } from 'react-icons/fi'
import {
  slideDownAndFade,
  slideLeftAndFade,
  slideRightAndFade,
  slideUpAndFade,
  styled,
} from 'src/libs/styled'
import { Flex } from './Flex'

const StyledPortal = styled(RPopover.Portal, {
  zIndex: 1000,
})

const StyledContent = styled(RPopover.Content, {
  borderRadius: 4,
  padding: 25,
  backgroundColor: '$cardBg',
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform, opacity',
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
})

const StyledArrow = styled(RPopover.Arrow, {
  fill: '$cardBg',
})

const StyledClose = styled(RPopover.Close, {
  all: 'unset',
  fontFamily: 'inherit',
  borderRadius: '100%',
  height: 20,
  width: 20,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$black',
  position: 'absolute',
  top: 5,
  right: 5,
  '&:hover': { color: '$background', backgroundColor: '$black' },
})

const StyledTrigger = styled(RPopover.Trigger, {
  background: 'transparent',
  padding: 1,
  border: '1px solid',
  borderRadius: '$control',
  borderColor: 'transparent',
  transition: 'all ease-in-out 0.2s',
  '&:hover': {
    borderColor: '$controlBorder',
    borderRadius: '$control',
  },
  variants: {
    clickable: {
      true: {
        cursor: 'pointer',
      },
    },
  },
})

interface PopoverProps {
  children: ReactNode
}

export const Popover = RPopover.Root

export const PopoverAnchor = RPopover.Anchor

export const PopoverTrigger = StyledTrigger

export const PopoverContent = ({ children }: PopoverProps) => (
  <StyledPortal>
    <StyledContent>
      <Flex css={{ maxWidth: 200, maxHeight: 200 }}>{children}</Flex>
      <StyledClose>
        <FiX />
      </StyledClose>
      <StyledArrow />
    </StyledContent>
  </StyledPortal>
)
