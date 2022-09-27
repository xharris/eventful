import { ReactNode, useEffect } from 'react'
import * as RadDialog from '@radix-ui/react-dialog'
import { useMediaQuery } from 'src/libs/styled'

export interface DialogProps {
  open: RadDialog.DialogProps['open']
  onOpenChange: RadDialog.DialogProps['onOpenChange']
  children: ReactNode
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => (
  <RadDialog.Root open={open} onOpenChange={onOpenChange}>
    <RadDialog.Portal>
      <RadDialog.Overlay
        style={{
          backgroundColor: 'black',
          position: 'fixed',
          inset: 0,
          opacity: 0.5,
        }}
        onClick={() => onOpenChange && onOpenChange(!open)}
      />
      <RadDialog.Content
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
      </RadDialog.Content>
    </RadDialog.Portal>
  </RadDialog.Root>
)
