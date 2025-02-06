import { Routes, Route } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { Overview } from '@/pages/dashboard/overview'
import { TestHistory } from '@/pages/dashboard/test-history'
import { NewTest } from '@/pages/dashboard/new-test'
import { BloodTestDetails } from '@/pages/dashboard/blood-test-details'
import { Login } from '@/pages/auth/login'
import { ProtectedRoute } from '@/components/auth/protected-route'

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="dashboard" element={<Overview />} />
        <Route path="dashboard/history" element={<TestHistory />} />
        <Route path="dashboard/new-test" element={<NewTest />} />
        <Route path="dashboard/blood-tests/:id" element={<BloodTestDetails />} />
        <Route path="dashboard/blood-tests/:id/edit" element={<NewTest />} />
      </Route>
    </Routes>
  )
}
