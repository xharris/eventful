import { Button, LinkButton } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { useSession } from 'src/eventfulLib/session'
import { FiHome, FiUsers } from 'react-icons/fi'
import { Container } from 'src/components/Flex'
import { ReactNode, useEffect } from 'react'
import { Avatar } from 'src/components/Avatar'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'

export const Page = ({ children }: { children: ReactNode }) => {
  const { session } = useSession()

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Blanke</IonTitle>
          </IonToolbar>
        </IonHeader>
        {children}
      </IonContent>
    </IonPage>
    // <Container css={{ padding: '$root' }}>
    //   <Flex column fill>
    //     <Flex className="page-header" row flex="0" css={{ justifyContent: 'space-between' }}>
    //       <Flex>
    //         <LinkButton to="/" variant="ghost" title="Home">
    //           <FiHome />
    //         </LinkButton>
    //         <LinkButton to="/users/search" variant="ghost" title="User search">
    //           <FiUsers />
    //         </LinkButton>
    //       </Flex>
    //       {session ? (
    //         <Avatar username={session.username} size="medium" to={`/u/${session.username}`} />
    //       ) : (
    //         // <LinkButton to={`/u/${session.username}`}>{session.username}</LinkButton>
    //         <LinkButton to="/auth">Log In</LinkButton>
    //       )}
    //     </Flex>
    //     <Outlet />
    //   </Flex>
    // </Container>
  )
}
