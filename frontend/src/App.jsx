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
import Annonces from './pages/Annonces'
import Profil from './pages/Profil'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Parametres from './pages/Parametres'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>

      <AuthProvider>
        <BrowserRouter>
          <ToastContainer position="top-right" autoClose={3000} />
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
              <Route path="/annonces" element={<Annonces />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/parametres" element={<Parametres />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App