import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  Users,
  Wallet,
  CalendarDays,
  PartyPopper,
  Megaphone,
  Settings,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'  // ← IMPORT DU LOGO

const navItems = [
  { to: '/', label: 'Tableau de bord', icon: LayoutGrid },
  { to: '/membres', label: 'Membres', icon: Users },
  { to: '/cotisations', label: 'Cotisations', icon: Wallet },
  { to: '/reunions', label: 'Réunions', icon: CalendarDays },
  { to: '/activites', label: 'Activités', icon: PartyPopper },
  { to: '/annonces', label: 'Annonces', icon: Megaphone },
]

function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="h-full w-[72px] bg-primary rounded-[28px] flex flex-col items-center py-6 shrink-0 shadow-sm">
      {/* Logo image */}
      <div className="relative mb-8 flex flex-col items-center">
        {/* Glow effect behind */}
        <div className="absolute inset-0 -m-3 rounded-2xl bg-emerald-400/20 blur-xl" />

        {/* Logo container */}
        <div className="relative w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-white/10 overflow-hidden">
          <img 
            src={logo} 
            alt="AEN" 
            className="w-10 h-10 object-contain"
          />
        </div>

        {/* Status dot */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-[2.5px] border-primary" />
      </div>

      {/* Divider */}
      <div className="w-8 h-[1px] bg-white/10 mb-4" />

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/50 hover:bg-white/10 hover:text-white/90'
              }`
            }
          >
            <Icon size={19} strokeWidth={1.75} />
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="flex flex-col gap-1.5">
        <div className="w-8 h-[1px] bg-white/10 mb-2" />

        <NavLink
          to="/parametres"
          className={({ isActive }) =>
            `group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isActive
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-white/50 hover:bg-white/10 hover:text-white/90'
            }`
          }
        >
          <Settings size={19} strokeWidth={1.75} />
          <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
            Paramètres
          </span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="group relative w-11 h-11 rounded-xl flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white/90 transition-all duration-200"
        >
          <LogOut size={19} strokeWidth={1.75} />
          <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
            Déconnexion
          </span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar