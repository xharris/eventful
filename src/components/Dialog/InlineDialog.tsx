import { ReactNode, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useMediaQuery } from 'src/libs/styled'

interface InlineDialogProps {
  open: Dialog.DialogProps['open']
  onOpenChange: Dialog.DialogProps['onOpenChange']
  children: ReactNode
}

export const InlineDialog = ({ open, onOpenChange, children }: InlineDialogProps) => {
  const isSmall = useMediaQuery({ maxSize: 'Tablet' })

  return isSmall ? (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            backgroundColor: 'black',
            position: 'fixed',
            inset: 0,
            opacity: 0.5,
          }}
          onClick={() => onOpenChange && onOpenChange(!open)}
        />
        <Dialog.Content
          style={{
            backgroundColor: 'white',
            borderRadius: 6,
            boxShadow:
              'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            // width: '90vw',
            maxWidth: '450px',
            maxHeight: '85vh',
            padding: 25,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ) : (
    <>{children}</>
  )
}
