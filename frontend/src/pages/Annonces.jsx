import { useState, useEffect } from 'react'
import { 
  Plus, 
  Pin, 
  Trash2, 
  Info, 
  AlertTriangle, 
  PartyPopper, 
  Clock, 
  Megaphone,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Filter,
  Search
} from 'lucide-react'
import { toast } from 'react-toastify'
import { annonceService } from '../services/annonceService'
import AnnonceFormModal from '../components/AnnonceFormModal'
import { useAuth } from '../context/AuthContext'

// ─── Type Config ──────────────────────────────────────────────────
const typeConfig = {
  INFORMATION: {
    label: 'Information',
    icon: Info,
    color: 'blue',
    border: 'border-l-blue-500 dark:border-l-blue-400',
    badge: 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300',
    iconBg: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',
    glow: 'hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10',
  },
  URGENT: {
    label: 'Urgent',
    icon: AlertTriangle,
    color: 'rose',
    border: 'border-l-rose-500 dark:border-l-rose-400',
    badge: 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300',
    iconBg: 'bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400',
    glow: 'hover:shadow-rose-500/5 dark:hover:shadow-rose-500/10',
  },
  EVENEMENT: {
    label: 'Événement',
    icon: PartyPopper,
    color: 'amber',
    border: 'border-l-amber-500 dark:border-l-amber-400',
    badge: 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
    glow: 'hover:shadow-amber-500/5 dark:hover:shadow-amber-500/10',
  },
}

// ─── Skeleton Components ──────────────────────────────────────────
const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />
)

const AnnonceSkeleton = () => (
  <div className="bg-white dark:bg-[#151922] rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
    <div className="flex items-start gap-3.5">
      <SkeletonPulse className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 min-w-0">
        <SkeletonPulse className="w-20 h-5 rounded-full mb-2" />
        <SkeletonPulse className="w-3/4 h-5 rounded-md mb-2" />
        <SkeletonPulse className="w-full h-4 rounded-md mb-1" />
        <SkeletonPulse className="w-2/3 h-4 rounded-md" />
        <SkeletonPulse className="w-32 h-3 rounded-md mt-3" />
      </div>
    </div>
  </div>
)

// ─── Format Date ──────────────────────────────────────────────────
function formatDate(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  let relativeTime
  if (diffMins < 1) relativeTime = "À l'instant"
  else if (diffMins < 60) relativeTime = `Il y a ${diffMins} min`
  else if (diffHours < 24) relativeTime = `Il y a ${diffHours}h`
  else if (diffDays === 1) relativeTime = 'Hier'
  else if (diffDays < 7) relativeTime = `Il y a ${diffDays} jours`
  else relativeTime = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

  const fullDate = date.toLocaleDateString('fr-FR', {
    day: '2-digit', 
    month: 'long', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
  })

  return { relativeTime, fullDate }
}

// ─── Empty State ──────────────────────────────────────────────────
const EmptyState = ({ onCreate, canManage }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center mb-4">
      <Megaphone size={28} className="text-gray-300 dark:text-gray-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
      Aucune annonce
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
      Les communications importantes de l'association apparaîtront ici.
    </p>
    {canManage && (
      <button
        onClick={onCreate}
        className="flex items-center gap-2 h-10 px-5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/20"
      >
        <Plus size={17} strokeWidth={2} />
        Publier une annonce
      </button>
    )}
  </div>
)

function Annonces() {
  const { canManage } = useAuth()
  const [annonces, setAnnonces] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [expandedIds, setExpandedIds] = useState(new Set())
  const [filterType, setFilterType] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const fetchAnnonces = async () => {
    setLoading(true)
    try {
      const data = await annonceService.getAll()
      // Trier : épinglées d'abord, puis par date décroissante
      const sorted = data.sort((a, b) => {
        if (a.epinglee && !b.epinglee) return -1
        if (!a.epinglee && b.epinglee) return 1
        return new Date(b.datePublication) - new Date(a.datePublication)
      })
      setAnnonces(sorted)
    } catch (error) {
      toast.error('Impossible de charger les annonces')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnonces()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette annonce ? Cette action est irréversible.')) return
    try {
      await annonceService.remove(id)
      toast.success('Annonce supprimée')
      setAnnonces((prev) => prev.filter((a) => a.id !== id))
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  // Filtrer les annonces
  const filteredAnnonces = annonces.filter((a) => {
    const matchType = filterType === 'ALL' || a.type === filterType
    const matchSearch = 
      searchQuery === '' || 
      a.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.contenu.toLowerCase().includes(searchQuery.toLowerCase())
    return matchType && matchSearch
  })

  // Stats
  const stats = {
    total: annonces.length,
    epinglees: annonces.filter(a => a.epinglee).length,
    urgentes: annonces.filter(a => a.type === 'URGENT').length,
  }

  return (
    <div className="w-full">
      {/* ─── Header Section ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone size={16} className="text-emerald-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Communications
            </p>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Annonces
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {stats.total} annonce{stats.total > 1 ? 's' : ''} publiée{stats.total > 1 ? 's' : ''}
            {stats.epinglees > 0 && ` · ${stats.epinglees} épinglée${stats.epinglees > 1 ? 's' : ''}`}
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 h-10 px-5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 shrink-0"
          >
            <Plus size={17} strokeWidth={2} />
            Publier
          </button>
        )}
      </div>

      {/* ─── Filters Bar ──────────────────────────────────────────── */}
      {!loading && annonces.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une annonce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-[#151922] border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400 shrink-0" />
            {[
              { key: 'ALL', label: 'Toutes' },
              { key: 'INFORMATION', label: 'Infos' },
              { key: 'URGENT', label: 'Urgentes' },
              { key: 'EVENEMENT', label: 'Événements' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`h-8 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                  filterType === f.key
                    ? 'bg-gray-900 dark:bg-gray-700 text-white'
                    : 'bg-white dark:bg-[#151922] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Loading State ────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <AnnonceSkeleton key={i} />
          ))}
        </div>
      ) : filteredAnnonces.length === 0 ? (
        <div className="bg-white dark:bg-[#151922] rounded-2xl border border-gray-100 dark:border-gray-800">
          <EmptyState onCreate={() => setShowModal(true)} canManage={canManage} />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnnonces.map((a, index) => {
            const config = typeConfig[a.type]
            const Icon = config.icon
            const isExpanded = expandedIds.has(a.id)
            const shouldTruncate = a.contenu.length > 180
            const { relativeTime, fullDate } = formatDate(a.datePublication)

            return (
              <div
                key={a.id}
                className={`group relative bg-white dark:bg-[#151922] rounded-2xl border border-gray-100 dark:border-gray-800 border-l-4 ${config.border} p-5 transition-all duration-300 hover:shadow-lg ${config.glow} hover:-translate-y-0.5`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Pin Badge */}
                {a.epinglee && (
                  <div className="absolute -top-2 -right-2">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold shadow-sm">
                      <Pin size={10} strokeWidth={2.5} fill="currentColor" />
                      Épinglée
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3.5">
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${config.iconBg}`}>
                    <Icon size={20} strokeWidth={1.75} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Badge + Date */}
                    <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${config.badge}`}>
                        <Icon size={11} strokeWidth={2.5} />
                        {config.label}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500" title={fullDate}>
                        {relativeTime}
                      </span>
                      {a.auteurEmail && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          · {a.auteurEmail}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-snug">
                      {a.titre}
                    </h3>

                    {/* Content */}
                    <div className="mt-2">
                      <p
                        className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line ${
                          !isExpanded && shouldTruncate ? 'line-clamp-2' : ''
                        }`}
                      >
                        {a.contenu}
                      </p>
                      
                      {shouldTruncate && (
                        <button
                          onClick={() => toggleExpand(a.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 mt-2 transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              Voir moins <ChevronUp size={13} />
                            </>
                          ) : (
                            <>
                              Lire la suite <ChevronDown size={13} />
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/50">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                        <Clock size={12} strokeWidth={1.75} />
                        <span>{fullDate}</span>
                      </div>

                      {canManage && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 size={13} strokeWidth={2} />
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ─── Modal ────────────────────────────────────────────────── */}
      {showModal && (
        <AnnonceFormModal
          onClose={() => setShowModal(false)}
          onCreated={fetchAnnonces}
        />
      )}
    </div>
  )
}

export default Annonces