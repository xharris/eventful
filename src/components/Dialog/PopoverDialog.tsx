import { PopoverAnchor } from '@radix-ui/react-popover'
import { ComponentProps } from '@stitches/react'
import { ReactNode, useEffect } from 'react'
import { useMediaQuery } from 'src/libs/styled'
import { Button } from '../Button'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover'
import { Dialog, DialogProps } from './index'

interface PopoverDialog extends DialogProps {
  trigger: ReactNode
  triggerProps?: ComponentProps<typeof PopoverTrigger>
}

export const PopoverDialog = ({
  open,
  onOpenChange,
  children,
  trigger,
  triggerProps,
}: PopoverDialog) => {
  const isSmall = useMediaQuery({ maxSize: 'Tablet' })

  return !isSmall ? (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor>{trigger}</PopoverAnchor>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  ) : (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
    </>
  )
}
