import { IonText } from '@ionic/react'
import { CSSProperties } from '@stitches/react'
import { StyledComponent } from '@stitches/react/types/styled-component'
import { ComponentProps } from 'react'
import { styled, css } from 'src/libs/styled'

const style = css({
  margin: 0,
  transition: 'all ease-in-out 0.2s',
  textDecorationLine: 'underline',
  textDecorationColor: 'transparent',
  fontWeight: 100,
  variants: {
    clickable: {
      true: {
        textDecorationColor: '$disabled',
        '&:hover': {
          textDecorationColor: '$black',
          cursor: 'pointer',
        },
      },
    },
    subtle: {
      true: {
        fontStyle: 'italic',
        opacity: 0.75,
      },
    },
    bold: {
      true: {
        fontWeight: 600,
      },
    },
    underline: {
      true: {
        textDecorationColor: '$black',
      },
    },
  },
})

type CSSBoolean = boolean | 'true' | undefined
type HeaderOptions = {
  clickable?: CSSBoolean
  subtle?: CSSBoolean
  bold?: CSSBoolean
  underline?: CSSBoolean
}
type HeaderProps = StyledComponent<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', HeaderOptions>

const withIonText =
  (Component: HeaderProps) =>
  ({
    css,
    clickable,
    underline,
    bold,
    children,
    ...props
  }: ComponentProps<typeof IonText> & HeaderOptions & Pick<ComponentProps<HeaderProps>, 'css'>) =>
    (
      <IonText {...props}>
        <Component css={css} clickable={clickable} underline={underline} bold={bold}>
          {children}
        </Component>
      </IonText>
    )

export const H1 = withIonText(
  styled('h1', {
    ...style,
    fontSize: '$1',
  })
)

export const H2 = withIonText(
  styled('h2', {
    ...style,
    fontSize: '$2',
  })
)
export const H3 = withIonText(
  styled('h3', {
    ...style,
    fontSize: '$3',
  })
)
export const H4 = withIonText(
  styled('h4', {
    ...style,
    fontSize: '$4',
  })
)
export const H5 = withIonText(
  styled('h5', {
    ...style,
    fontSize: '$5',
  })
)
export const H6 = withIonText(
  styled('h6', {
    ...style,
    fontSize: '$6',
  })
)
