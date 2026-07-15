import { NavLink } from 'react-router-dom'
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

const navItems = [
  { to: '/', label: 'Tableau de bord', icon: LayoutGrid },
  { to: '/membres', label: 'Membres', icon: Users },
  { to: '/cotisations', label: 'Cotisations', icon: Wallet },
  { to: '/reunions', label: 'Réunions', icon: CalendarDays },
  { to: '/activites', label: 'Activités', icon: PartyPopper },
  { to: '/annonces', label: 'Annonces', icon: Megaphone },
]

function Sidebar() {
  return (
    <aside className="h-full w-24 bg-primary rounded-[28px] flex flex-col items-center py-6 shrink-0 shadow-sm">
      <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center mb-8">
        <span className="text-white font-heading font-semibold text-sm">AEN</span>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={label}
            className={({ isActive }) =>
              `group relative w-11 h-11 rounded-button flex items-center justify-center transition-colors duration-150 ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/50 hover:bg-white/10 hover:text-white/85'
              }`
            }
          >
            <Icon size={19} strokeWidth={1.75} />
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-2">
        <NavLink
          to="/parametres"
          title="Paramètres"
          className={({ isActive }) =>
            `group relative w-11 h-11 rounded-button flex items-center justify-center transition-colors duration-150 ${
              isActive
                ? 'bg-white/15 text-white'
                : 'text-white/50 hover:bg-white/10 hover:text-white/85'
            }`
          }
        >
          <Settings size={19} strokeWidth={1.75} />
          <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
            Paramètres
          </span>
        </NavLink>

        <button
          title="Déconnexion"
          className="w-11 h-11 rounded-button flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white/85 transition-colors duration-150"
        >
          <LogOut size={19} strokeWidth={1.75} />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar