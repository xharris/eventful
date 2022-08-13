import { ComponentProps } from '@stitches/react'
import { To } from 'react-router-dom'
import { css, styled } from 'src/libs/styled'
import { Flex } from './Flex'
import { Link } from './Link'

const Component = styled(Flex, {
  borderRadius: '100%',
  flex: 0,
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  variants: {
    size: {
      small: {
        width: '21px',
        height: '21px',
        minWidth: '21px',
        minHeight: '21px',
        fontSize: '0.7rem',
      },
      medium: {
        width: '40px',
        height: '40px',
        minWidth: '40px',
        minHeight: '40px',
        fontSize: '0.75rem',
        fontWeight: 600,
      },
      large: {
        width: '80px',
        height: '80px',
        minWidth: '80px',
        minHeight: '80px',
        fontSize: '1.5rem',
        fontWeight: 700,
      },
    },
  },
})

interface AvatarProps extends ComponentProps<typeof Component> {
  username?: string
  color?: string
  to?: To
}

export const Avatar = ({
  username,
  color = '#CFD8DC',
  css,
  size = 'small',
  to,
  ...props
}: AvatarProps) => (
  <Link to={to}>
    <Component
      {...props}
      size={size}
      css={{
        ...css,
        backgroundColor: color,
      }}
      data-testid="avatar"
    >
      {username?.slice(0, 2).toUpperCase() ?? ''}
    </Component>
  </Link>
)

const AvatarGroupSpan = styled('span', {
  display: 'inline-block',
  overflow: 'hidden',
  '&:not(:first-child)': {
    marginLeft: -8,
    mask: 'radial-gradient(circle 10px at 0px 50%,transparent 99%,#fff 100%)',
    WebkitMask: 'radial-gradient(circle 10px at 0px 50%,transparent 99%,#fff 100%)',
  },
})

interface AvatarGroupProps extends AvatarProps {
  avatars?: Pick<AvatarProps, 'username' | 'color'>[]
  limit?: number
}

export const AvatarGroup = ({ avatars, limit = 3, ...props }: AvatarGroupProps) => (
  <Flex
    css={{
      gap: '$small',
      alignItems: 'center',
    }}
    flex="0"
  >
    <Flex
      css={{
        gap: 0,
      }}
    >
      {avatars?.slice(0, limit).map((avatar, a, arr) => (
        <AvatarGroupSpan
          key={avatar.username}
          css={{
            zIndex: arr.length - a,
          }}
        >
          <Avatar {...props} {...avatar} />
        </AvatarGroupSpan>
      ))}
    </Flex>
    {avatars && avatars?.length > limit && (
      <Flex
        css={{
          fontSize: '$small',
        }}
      >{`+${avatars.length - limit}`}</Flex>
    )}
  </Flex>
)
