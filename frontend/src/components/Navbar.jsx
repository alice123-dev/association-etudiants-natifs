import { Bell, Moon, Sun, Search, LogOut, ChevronDown, User, Sparkles, Shield, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { profilService } from '../services/profilService'

const roleLabels = {
  ADMINISTRATEUR: 'Administrateur',
  BUREAU: 'Bureau',
  MEMBRE: 'Membre',
}

const roleConfig = {
  ADMINISTRATEUR: { gradient: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/30' },
  BUREAU: { gradient: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-500/30' },
  MEMBRE: { gradient: 'from-gray-400 to-slate-500', shadow: 'shadow-gray-500/30' },
}

export default function Navbar() {

  const { darkMode, toggleDarkMode } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifCount, setNotifCount] = useState(2)
  const [photoUrl, setPhotoUrl] = useState(null)
  const menuRef = useRef(null)
  const notifRef = useRef(null)
  const searchRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const markAllRead = () => setNotifCount(0)

  useEffect(() => {
    profilService.getProfil().then((data) => {
      if (data.photoUrl) {
        setPhotoUrl(`http://localhost:8080${data.photoUrl}`)
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const initiales = user?.email?.[0]?.toUpperCase() ?? '?'
  const roleLabel = roleLabels[user?.role] ?? user?.role
  const roleCfg = roleConfig[user?.role] ?? roleConfig.MEMBRE

  const notifications = [
    { id: 1, title: 'Nouvelle cotisation', desc: 'nandra KOTO a payé 14 941 Ar', time: 'Il y a 2h', unread: true, icon: '💰' },
    { id: 2, title: 'Nouveau membre', desc: 'max Steven a rejoint l\'association', time: 'Il y a 5h', unread: true, icon: '👤' },
  ]

  return (
    <header className="h-[72px] flex items-center justify-between px-2 shrink-0">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Tableau de bord
        </h1>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <Sparkles size={10} strokeWidth={2.5} />
          En ligne
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Search */}
        <div className={`relative hidden md:block transition-all duration-500 ease-out ${searchFocused ? 'w-80 lg:w-96' : 'w-52 lg:w-64'}`}>
          <Search size={15} strokeWidth={2} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none ${searchFocused ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'}`} />
          <input
            ref={searchRef}
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-10 pl-10 pr-10 rounded-xl bg-white dark:bg-[#161922] border border-gray-200/50 dark:border-gray-800/50 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:bg-white dark:focus:bg-[#1A1D2A] focus:border-emerald-300 dark:focus:border-emerald-500/30 focus:shadow-lg focus:shadow-emerald-500/5 transition-all duration-300"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X size={13} strokeWidth={2.5} />
            </button>
          )}
          <kbd className="hidden lg:inline-flex absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] font-semibold text-gray-400 dark:text-gray-500 tracking-wider">
          </kbd>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="relative w-10 h-10 rounded-xl bg-white dark:bg-[#161922] border border-gray-200/50 dark:border-gray-800/50 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg hover:shadow-gray-200/30 dark:hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden"
          aria-label="Basculer le mode sombre"
        >
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${darkMode ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
            <Moon size={17} strokeWidth={1.75} />
          </div>
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${darkMode ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`}>
            <Sun size={17} strokeWidth={1.75} className="text-amber-500" />
          </div>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-10 h-10 rounded-xl bg-white dark:bg-[#161922] border border-gray-200/50 dark:border-gray-800/50 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg hover:shadow-gray-200/30 dark:hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            aria-label="Notifications"
          >
            <Bell size={17} strokeWidth={1.75} />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white px-1 shadow-md shadow-red-500/30 ring-2 ring-[#F5F3EE] dark:ring-[#0F1117]">
                {notifCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-[#161922] rounded-2xl shadow-2xl shadow-black/8 dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden z-50 origin-top-right animate-in zoom-in-95 fade-in duration-200">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Notifications</p>
                  <p className="text-xs text-gray-400 mt-0.5">{notifCount > 0 ? `Vous avez ${notifCount} notification${notifCount > 1 ? 's' : ''} non lue${notifCount > 1 ? 's' : ''}` : 'Aucune notification non lue'}</p>
                </div>
                {notifCount > 0 && (
                  <button onClick={markAllRead} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">
                    <Sparkles size={11} strokeWidth={2.5} />
                    Tout lire
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center mb-3">
                      <Bell size={20} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Aucune notification</p>
                    <p className="text-xs text-gray-400 mt-0.5">Les alertes apparaîtront ici</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className={`group px-5 py-3.5 flex items-start gap-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-150 cursor-pointer border-b border-gray-50 dark:border-gray-800/50 last:border-0 ${notif.unread ? 'bg-emerald-50/40 dark:bg-emerald-500/[0.03]' : ''}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${notif.unread ? 'bg-emerald-100 dark:bg-emerald-500/15' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        {notif.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{notif.title}</p>
                          {notif.unread && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5 shadow-sm shadow-emerald-500/30" />}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{notif.desc}</p>
                        <p className="text-[11px] text-gray-400 mt-1.5 font-medium">{notif.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-all duration-200 group"
          >
            <div className="relative">
              <div className={`w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br ${roleCfg.gradient} text-white flex items-center justify-center text-xs font-bold ${roleCfg.shadow} shadow-lg ring-2 ring-white/50 dark:ring-[#0F1117]/50 transition-transform duration-300 group-hover:scale-105`}>
                {photoUrl ? (
                  <img src={photoUrl} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  initiales
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-[2.5px] border-[#F5F3EE] dark:border-[#0F1117] shadow-sm" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate max-w-[140px]">{user?.email?.split('@')[0] ?? 'Utilisateur'}</p>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5 font-medium">{roleLabel}</p>
            </div>
            <ChevronDown size={14} strokeWidth={2.5} className={`text-gray-400 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-14 w-80 bg-white dark:bg-[#161922] rounded-2xl shadow-2xl shadow-black/8 dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden z-50 origin-top-right animate-in zoom-in-95 fade-in duration-200">
              <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br ${roleCfg.gradient} text-white flex items-center justify-center text-sm font-bold ${roleCfg.shadow} shadow-lg`}>
                      {photoUrl ? (
                        <img src={photoUrl} alt="Profil" className="w-full h-full object-cover" />
                      ) : (
                        initiales
                      )}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-[2.5px] border-white dark:border-[#161922] shadow-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.email}</p>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20">
                        <Shield size={10} strokeWidth={2.5} />
                        {roleLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        <Sparkles size={9} strokeWidth={2.5} />
                        En ligne
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={() => { setMenuOpen(false); navigate('/profil') }}
                  className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200 group/item"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover/item:bg-gray-200 dark:group-hover/item:bg-gray-700 transition-colors duration-200">
                    <User size={15} strokeWidth={2} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <span className="font-semibold">Mon profil</span>
                </button>

                <div className="my-1.5 border-t border-gray-100 dark:border-gray-800 mx-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 group/item"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center group-hover/item:bg-red-100 dark:group-hover/item:bg-red-500/20 transition-colors duration-200">
                    <LogOut size={15} strokeWidth={2} className="text-red-500" />
                  </div>
                  <span className="font-semibold">Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}