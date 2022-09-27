import type * as Stitches from '@stitches/react'
import { ComponentProps } from 'react'
import { IconType } from 'react-icons'
import { styled, css, config } from 'src/libs/styled'
import { Flex } from './Flex'

const Component = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
})

interface IconProps extends Omit<ComponentProps<typeof Component>, 'square'> {
  icon: IconType
  square?: number | string | true
  subtle?: boolean
  size?: number
}

export const Icon = ({ icon, css, square, subtle, size, color, ...props }: IconProps) => (
  <Component
    css={{
      ...css,
      width: square === true ? 32 : square,
      height: square === true ? 32 : square,
      fontSize: size,
      color,
      ...(square
        ? {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }
        : {}),
      opacity: subtle ? 0.5 : 1,
    }}
    {...props}
  >
    {icon({})}
  </Component>
)

interface IconSideProps extends Omit<IconProps, 'color' | 'icon'> {
  icon?: IconProps['icon']
  subtle?: IconProps['subtle']
  flexProps?: ComponentProps<typeof Flex>
  color?: Stitches.CSS<typeof config>['color']
}

export const IconSide = ({ children, css, flexProps, color, icon, ...props }: IconSideProps) => (
  <Flex
    css={{
      alignItems: 'center',
      gap: '$small',
    }}
    {...flexProps}
  >
    {icon && (
      <Icon
        {...props}
        icon={icon}
        css={{
          ...css,
          color,
        }}
      />
    )}
    {children}
  </Flex>
)
