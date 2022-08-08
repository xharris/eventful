import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Auth } from './pages/Auth'
import { Event } from './pages/Event'
import { Events } from './pages/Events'
import { Page } from './pages/Page'
import { User } from './pages/User'

const qc = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Page />}>
            <Route index element={<Navigate to="/events" />} />
            <Route path="events" element={<Events />} />
            <Route path="e">
              <Route path=":eventId" element={<Event />} />
            </Route>
            <Route path="u">
              <Route path=":username" element={<User />} />
            </Route>
          </Route>
          <Route path="auth" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
