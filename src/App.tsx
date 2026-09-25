import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
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
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/recurring" element={<Recurring />} />
        <Route path="/savings-goals" element={<SavingsGoals />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/backups" element={<Backups />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}