import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { RootLayout } from '@/layouts/root-layout'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { LoginPage } from '@/pages/login'
import { DashboardOverview } from '@/pages/dashboard/overview'
import { TestHistory } from '@/pages/dashboard/test-history'
import { NewBloodTestPage } from '@/pages/dashboard/new-test'
import { BloodTestDetails } from '@/pages/dashboard/blood-test-details'
import { EditBloodTestPage } from '@/pages/dashboard/edit-blood-test'
import { AuthProvider, useAuth } from '@/lib/contexts/auth-context'
import { ThemeProvider } from '@/components/theme-provider'
import { testFirebaseConnection } from '@/lib/firebase'
import { toast } from 'sonner'

// Private Route component
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

// Public Route component (redirects to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export function App() {
  const [isCheckingConnection, setIsCheckingConnection] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function checkConnection() {
      try {
        const isConnected = await testFirebaseConnection()
        if (!isMounted) return

        if (!isConnected) {
          console.warn('Firebase connection test failed')
        } else {
          console.log('Firebase connection test successful')
        }
      } catch (error) {
        if (!isMounted) return
        console.error('Connection test error:', error)
      } finally {
        if (isMounted) {
          setIsCheckingConnection(false)
        }
      }
    }

    checkConnection()
    return () => {
      isMounted = false
    }
  }, [])

  if (isCheckingConnection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Initializing application...</p>
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <Router>
          <Toaster position="top-right" richColors />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />

            {/* Protected dashboard routes */}
            <Route element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }>
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/dashboard/history" element={<TestHistory />} />
              <Route path="/dashboard/new-test" element={<NewBloodTestPage />} />
              <Route path="/dashboard/blood-tests/:id" element={<BloodTestDetails />} />
              <Route path="/dashboard/blood-tests/:id/edit" element={<EditBloodTestPage />} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}
