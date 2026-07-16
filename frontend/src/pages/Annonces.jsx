import { useState, useEffect } from 'react'
import { Plus, Pin, Trash2, Info, AlertTriangle, PartyPopper, Clock } from 'lucide-react'
import { toast } from 'react-toastify'
import { annonceService } from '../services/annonceService'
import AnnonceFormModal from '../components/AnnonceFormModal'

const typeConfig = {
  INFORMATION: {
    label: 'Information',
    icon: Info,
    border: 'border-l-info',
    badge: 'bg-info/10 text-info',
    iconBg: 'bg-info/10 text-info',
  },
  URGENT: {
    label: 'Urgent',
    icon: AlertTriangle,
    border: 'border-l-error',
    badge: 'bg-error/10 text-error',
    iconBg: 'bg-error/10 text-error',
  },
  EVENEMENT: {
    label: 'Événement',
    icon: PartyPopper,
    border: 'border-l-accent',
    badge: 'bg-accent/10 text-accent',
    iconBg: 'bg-accent/10 text-accent',
  },
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function Annonces() {
  const [annonces, setAnnonces] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [expandedIds, setExpandedIds] = useState(new Set())


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
      setAnnonces(data)
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
    if (!confirm('Supprimer cette annonce ?')) return
    try {
      await annonceService.remove(id)
      toast.success('Annonce supprimée')
      setAnnonces((prev) => prev.filter((a) => a.id !== id))
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  return (
    <div className="pt-2">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-heading text-xl font-semibold text-gray-800">Annonces</h2>
          <p className="text-sm text-gray-500 mt-0.5">Communications de l'association</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 h-10 px-4 rounded-button bg-primary text-white text-sm font-medium hover:brightness-110 transition"
        >
          <Plus size={17} strokeWidth={2} />
          Publier une annonce
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-card border border-black/5 p-10 text-center text-sm text-gray-400">
          Chargement...
        </div>
      ) : annonces.length === 0 ? (
        <div className="bg-white rounded-card border border-black/5 p-10 text-center text-sm text-gray-400">
          Aucune annonce publiée
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {annonces.map((a) => {
            const config = typeConfig[a.type]
            const Icon = config.icon
            return (
              <div
                key={a.id}
                className={`bg-white rounded-card border border-black/5 border-l-4 ${config.border} p-5 relative`}
              >
                {a.epinglee && (
                  <div className="absolute top-4 right-4 text-accent" title="Épinglée">
                    <Pin size={15} strokeWidth={2} fill="currentColor" />
                  </div>
                )}

                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.iconBg}`}>
                    <Icon size={18} strokeWidth={1.75} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${config.badge}`}>
                        {config.label}
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-semibold text-gray-800 mt-1.5">
                    {a.titre}
                    </h3>
                    <p
                    className={`text-sm text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line ${
                        expandedIds.has(a.id) ? '' : 'line-clamp-2'
                    }`}
                    >
                    {a.contenu}
                    </p>
                    {a.contenu.length > 120 && (
                    <button
                        onClick={() => toggleExpand(a.id)}
                        className="text-xs text-secondary font-medium hover:underline mt-1.5"
                    >
                        {expandedIds.has(a.id) ? 'Voir moins' : 'Lire la suite'}
                    </button>
)}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
                      <Clock size={12} strokeWidth={1.75} />
                      {formatDate(a.datePublication)}
                      {a.auteurEmail && <span>· {a.auteurEmail}</span>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-gray-300 hover:text-error transition-colors shrink-0"
                  >
                    <Trash2 size={16} strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

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