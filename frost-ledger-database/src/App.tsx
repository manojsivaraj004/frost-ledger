import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import Accounts from './pages/Accounts'
import Recurring from './pages/Recurring'
import SavingsGoals from './pages/SavingsGoals'
import Reports from './pages/Reports'
import Backups from './pages/Backups'
import Settings from './pages/Settings'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public route */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/recurring" element={<Recurring />} />
          <Route path="/savings-goals" element={<SavingsGoals />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/backups" element={<Backups />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Auth />} />
      </Routes>
    </AuthProvider>
  )
}