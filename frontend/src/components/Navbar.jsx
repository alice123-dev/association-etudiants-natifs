import { Bell, Moon, Sun, Search, LogOut, ChevronDown, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
const roleLabels = {
  ADMINISTRATEUR: 'Administrateur',
  BUREAU: 'Bureau',
  MEMBRE: 'Membre',
}

function Navbar() {
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initiales = user?.email?.[0]?.toUpperCase() ?? '?'
  const roleLabel = roleLabels[user?.role] ?? user?.role

  return (
    <header className="h-20 flex items-center justify-between px-8 shrink-0">
      <div>
        <h2 className="font-heading text-xl font-semibold text-gray-800">
          Bonjour, {roleLabel} 👋
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Voici un aperçu de l'association aujourd'hui
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={16} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-56 h-10 pl-9 pr-3 rounded-button bg-white border border-black/5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
          />
        </div>

        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors duration-150"
          aria-label="Basculer le mode sombre"
        >
          {darkMode ? <Sun size={17} strokeWidth={1.75} /> : <Moon size={17} strokeWidth={1.75} />}
        </button>

        <button
          className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors duration-150 relative"
          aria-label="Notifications"
        >
          <Bell size={17} strokeWidth={1.75} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full" />
        </button>

        {/* Menu utilisateur */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-black/5 transition-colors duration-150 ml-1"
          >
            <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-medium">
              {initiales}
            </div>
            <ChevronDown size={15} strokeWidth={1.75} className="text-gray-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 bg-white rounded-button shadow-lg border border-black/5 py-2 w-56 z-50">
              <div className="px-3.5 py-2 border-b border-black/5">
                <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
                <p className="text-xs text-gray-400 mt-0.5">{roleLabel}</p>
              </div>
              <button
                onClick={() => { setMenuOpen(false); navigate('/profil') }}
                className="flex items-center gap-2 w-full px-3.5 py-2 text-sm text-gray-700 hover:bg-black/5 transition-colors"
              >
                <User size={16} strokeWidth={1.75} />
                Mon profil
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3.5 py-2 text-sm text-error hover:bg-error/5 transition-colors mt-1"
              >
                <LogOut size={16} strokeWidth={1.75} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar