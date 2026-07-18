import { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { membreService } from '../services/membreService'
import MembreFormModal from '../components/MembreFormModal'
import { Search, Plus, MoreVertical, Trash2, Mail, Phone, GraduationCap, KeyRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const roleBureauLabels = {
  PRESIDENT: 'Président',
  VICE_PRESIDENT: 'Vice-président',
  SECRETAIRE: 'Secrétaire',
  TRESORIER: 'Trésorier',
}

const avatarPalette = [
  'bg-secondary/15 text-secondary',
  'bg-accent/15 text-accent',
  'bg-info/15 text-info',
  'bg-success/15 text-success',
]

function initiales(nom, prenom) {
  return `${prenom?.[0] ?? ''}${nom?.[0] ?? ''}`.toUpperCase()
}

function avatarColor(id) {
  return avatarPalette[id % avatarPalette.length]
}

function Membres() {
  const { canManage } = useAuth()
  const [membres, setMembres] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)

  const fetchMembres = async () => {
    setLoading(true)
    try {
      const data = await membreService.getAll()
      setMembres(data)
    } catch (error) {
      toast.error('Impossible de charger les membres')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembres()
  }, [])

  const filteredMembres = useMemo(() => {
    const query = search.toLowerCase().trim()
    if (!query) return membres
    return membres.filter(
      (m) =>
        m.nom.toLowerCase().includes(query) ||
        m.prenom.toLowerCase().includes(query) ||
        m.email?.toLowerCase().includes(query)
    )
  }, [membres, search])

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce membre ?')) return
    try {
      await membreService.remove(id)
      toast.success('Membre supprimé')
      setMembres((prev) => prev.filter((m) => m.id !== id))
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
    setOpenMenuId(null)
  }
  const handleResetPassword = async (id) => {
    try {
      const result = await membreService.resetPassword(id)
      toast.success(`Nouveau mot de passe : ${result.motDePasse}`, { autoClose: false })
    } catch (error) {
      toast.error('Erreur lors de la réinitialisation')
    }
    setOpenMenuId(null)
  }
  return (
    <div className="pt-2">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-heading text-xl font-semibold text-gray-800">Membres</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {membres.length} membre{membres.length > 1 ? 's' : ''} au total
          </p>
        </div>
        {canManage && (
  <button
    onClick={() => setShowModal(true)}
    className="flex items-center gap-2 h-10 px-4 rounded-button bg-primary text-white text-sm font-medium hover:brightness-110 transition"
  >
    <Plus size={17} strokeWidth={2} />
    Ajouter un membre
  </button>
)}
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-5 max-w-sm">
        <Search size={16} strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un membre..."
          className="w-full h-10 pl-10 pr-3 rounded-button bg-white border border-black/5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
        />
      </div>

      {/* Grille de cartes */}
      {loading ? (
        <div className="bg-white rounded-card border border-black/5 p-10 text-center text-sm text-gray-400">
          Chargement...
        </div>
      ) : filteredMembres.length === 0 ? (
        <div className="bg-white rounded-card border border-black/5 p-10 text-center text-sm text-gray-400">
          Aucun membre trouvé
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMembres.map((membre) => (
            <div
              key={membre.id}
              className="bg-white rounded-card border border-black/5 p-5 relative hover:shadow-sm transition-shadow"
            >
              {/* Menu contextuel */}
              {canManage && (
  <button
    onClick={() => setOpenMenuId(openMenuId === membre.id ? null : membre.id)}
    className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 transition-colors p-1"
  >
    <MoreVertical size={17} strokeWidth={1.75} />
  </button>
)}
              {openMenuId === membre.id && (
                <div className="absolute right-4 top-11 bg-white rounded-button shadow-lg border border-black/5 py-1 z-10 w-48">
                  <button
                    onClick={() => handleResetPassword(membre.id)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-600 hover:bg-black/5 transition-colors"
                  >
                    <KeyRound size={14} strokeWidth={1.75} />
                    Réinitialiser mot de passe
                  </button>
                  <button
                    onClick={() => handleDelete(membre.id)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-error hover:bg-error/5 transition-colors"
                  >
                    <Trash2 size={14} strokeWidth={1.75} />
                    Supprimer
                  </button>
                </div>
              )}

              {/* Avatar + statut */}
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold ${avatarColor(membre.id)}`}>
                    {initiales(membre.nom, membre.prenom)}
                  </div>
                  <span
                    className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      membre.actif ? 'bg-success' : 'bg-gray-300'
                    }`}
                  />
                </div>

                <p className="font-heading font-semibold text-gray-800 mt-3">
                  {membre.prenom} {membre.nom}
                </p>

                {membre.roleBureau ? (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium mt-1.5">
                    {roleBureauLabels[membre.roleBureau]}
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium mt-1.5">
                    Membre
                  </span>
                )}
              </div>

              {/* Infos */}
              <div className="mt-4 pt-4 border-t border-black/5 space-y-2">
                {membre.filiere && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <GraduationCap size={14} strokeWidth={1.75} className="text-gray-400 shrink-0" />
                    <span className="truncate">{membre.filiere} {membre.niveauEtudes && `· ${membre.niveauEtudes}`}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail size={14} strokeWidth={1.75} className="text-gray-400 shrink-0" />
                  <span className="truncate">{membre.email || '—'}</span>
                </div>
                {membre.telephone && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone size={14} strokeWidth={1.75} className="text-gray-400 shrink-0" />
                    <span className="truncate">{membre.telephone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <MembreFormModal
          onClose={() => setShowModal(false)}
          onCreated={fetchMembres}
        />
      )}
    </div>
  )
}

export default Membres