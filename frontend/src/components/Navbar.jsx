import { Bell, Moon, Sun, Search } from 'lucide-react'
import { useState } from 'react'

function Navbar() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="h-20 flex items-center justify-between px-8 shrink-0">
      <div>
        <h2 className="font-heading text-xl font-semibold text-gray-800">Bonjour, Administrateur 👋</h2>
        <p className="text-sm text-gray-500 mt-0.5">Voici un aperçu de l'association aujourd'hui</p>
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

        <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-medium ml-1">
          AD
        </div>
      </div>
    </header>
  )
}

export default Navbar