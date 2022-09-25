import { Link as RLink, LinkProps as RLinkProps } from 'react-router-dom'

interface LinkProps extends Omit<RLinkProps, 'to'> {
  to?: RLinkProps['to']
}

export const Link = ({ to, children, ...props }: LinkProps) =>
  to ? (
    <RLink {...props} to={to}>
      {children}
    </RLink>
  ) : (
    <>{children}</>
  )
