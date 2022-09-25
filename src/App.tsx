import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useReminderScheduler } from './eventfulLib/reminder'
import { SessionProvider, useSession } from './eventfulLib/session'
import { globalStyles } from './libs/styled'
import { Auth } from './pages/Auth'
import { Event } from './pages/Event'
import { Events } from './pages/Events'
import { Page } from './pages/Page'
import { User } from './pages/User'
import { UserSearch } from './pages/UserSearch'

import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

localStorage.debug = 'eventful:*'

const qc = new QueryClient()

const Inner = () => {
  useSession(true)
  useReminderScheduler()
  return null
}

setupIonicReact()

function App() {
  globalStyles()

  return (
    <IonApp>
      <QueryClientProvider client={qc}>
        <SessionProvider>
          <Inner />
          <IonReactRouter>
            <IonRouterOutlet>
              <Route path="/" exact>
                <Redirect to="/events" />
              </Route>
              <Route path="/events" component={Events} />
              <Route path="/auth" component={Auth} />
            </IonRouterOutlet>
          </IonReactRouter>
          {/* <BrowserRouter>
          <Routes>
            <Route path="/" element={<Page />}>
              <Route index element={<Navigate to="/events" />} />
              <Route path="events" element={<Events />} />
              <Route path="users">
                <Route path="search" element={<UserSearch />} />
              </Route>
              <Route path="e">
                <Route path=":eventId" element={<Event />} />
              </Route>
              <Route path="u">
                <Route path=":username" element={<User />} />
              </Route>
            </Route>
            <Route path="auth" element={<Auth />} />+
          </Routes>
        </BrowserRouter> */}
        </SessionProvider>
      </QueryClientProvider>
    </IonApp>
  )
}

export default App
