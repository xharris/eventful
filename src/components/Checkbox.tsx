import { HTMLProps } from 'react'
import { styled } from 'src/features/styled'

const Label = styled('label', {
  cursor: 'pointer',
  padding: '$controlPadding',
  display: 'flex',
  fontSize: '$control',
  gap: '0.5rem',
  userSelect: 'none',
})

interface Props extends HTMLProps<HTMLInputElement> {
  label: string
}

const Component = ({ label, ...props }: Props) => (
  <Label>
    <input {...props} type="checkbox" />
    <span>{label}</span>
  </Label>
)

export const Checkbox = styled(Component, {})
