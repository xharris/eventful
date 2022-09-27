import { ReactNode, useEffect } from 'react'
import { useMediaQuery } from 'src/libs/styled'
import { Dialog, DialogProps } from './index'

interface InlineDialogProps extends DialogProps {}

/** if the display is large enough, children will be displayed normally, else it will appear in a dialog */
export const InlineDialog = ({ open, onOpenChange, children }: InlineDialogProps) => {
  const isSmall = useMediaQuery({ maxSize: 'Tablet' })

  return isSmall ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  ) : (
    <>{children}</>
  )
}
