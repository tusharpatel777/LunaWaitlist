import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { WaitlistProvider } from './context/WaitlistContext'
import { useAuth } from './hooks/useAuth'
import DashboardLayout from './layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Users from './pages/Users'
import Login from './pages/Login'

export default function App() {
  const { authed, login, logout } = useAuth()

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'rgba(13, 13, 26, 0.97)',
            color: '#fff',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '12px',
            fontSize: '14px',
            backdropFilter: 'blur(20px)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      {!authed ? (
        <Login onLogin={login} />
      ) : (
        <BrowserRouter>
          <WaitlistProvider>
            <Routes>
              <Route path="/" element={<DashboardLayout onLogout={logout} />}>
                <Route index element={<Dashboard />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="users" element={<Users />} />
              </Route>
            </Routes>
          </WaitlistProvider>
        </BrowserRouter>
      )}
    </>
  )
}
