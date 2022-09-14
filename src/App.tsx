import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SessionProvider, useSession } from './eventfulLib/session'
import { globalStyles } from './libs/styled'
import { Auth } from './pages/Auth'
import { Event } from './pages/Event'
import { Events } from './pages/Events'
import { Page } from './pages/Page'
import { User } from './pages/User'
import { UserSearch } from './pages/UserSearch'

const qc = new QueryClient()

const Inner = () => {
  useSession(true)
  return null
}

function App() {
  globalStyles()

  return (
    <QueryClientProvider client={qc}>
      <SessionProvider>
        <Inner />
        <BrowserRouter>
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
        </BrowserRouter>
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default App
