import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Membres from './pages/Membres'
import Cotisations from './pages/Cotisations'
import Reunions from './pages/Reunions'
import Activites from './pages/Activites'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/membres" element={<Membres />} />
            <Route path="/cotisations" element={<Cotisations />} />
            <Route path="/reunions" element={<Reunions />} />
            <Route path="/activites" element={<Activites />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App