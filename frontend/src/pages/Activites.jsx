import { useState, useEffect, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {
  Plus, Search, Trash2, Pencil, MapPin, Users, Calendar as CalendarIcon,
  PartyPopper, CheckCircle2, Clock, Image as ImageIcon,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { activiteService } from '../services/activiteService'
import ActiviteFormModal from '../components/ActiviteFormModal'
import { useAuth } from '../context/AuthContext'

const categorieLabels = {
  SPORT: 'Sport',
  CULTUREL: 'Culturel',
  ACADEMIQUE: 'Académique',
  SOCIAL: 'Social',
  CARITATIF: 'Caritatif',
  AUTRE: 'Autre',
}

const categorieColors = {
  SPORT: 'bg-info/10 text-info',
  CULTUREL: 'bg-accent/10 text-accent',
  ACADEMIQUE: 'bg-secondary/10 text-secondary',
  SOCIAL: 'bg-success/10 text-success',
  CARITATIF: 'bg-error/10 text-error',
  AUTRE: 'bg-gray-100 text-gray-500',
}

const statutConfig = {
  A_VENIR: { label: 'À venir', className: 'bg-success/10 text-success' },
  EN_COURS: { label: 'En cours', className: 'bg-accent/10 text-accent' },
  TERMINEE: { label: 'Terminée', className: 'bg-gray-100 dark:bg-dark-surface-2 text-gray-500 dark:text-dark-text-muted' },
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function Activites() {
  const { canManage } = useAuth()
  const [activites, setActivites] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtreCategorie, setFiltreCategorie] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('')
  const [filtreDate, setFiltreDate] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingActivite, setEditingActivite] = useState(null)

  const fetchActivites = async () => {
    setLoading(true)
    try {
      const data = await activiteService.getAll()
      setActivites(data)
    } catch (error) {
      toast.error('Impossible de charger les activités')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivites()
  }, [])

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim()
    return activites.filter((a) => {
      const matchSearch = !query || a.titre.toLowerCase().includes(query) || a.lieu?.toLowerCase().includes(query)
      const matchCategorie = !filtreCategorie || a.categorie === filtreCategorie
      const matchStatut = !filtreStatut || a.statut === filtreStatut
      const matchDate = !filtreDate || a.date === filtreDate
      return matchSearch && matchCategorie && matchStatut && matchDate
    })
  }, [activites, search, filtreCategorie, filtreStatut, filtreDate])

  const stats = useMemo(() => {
    const total = activites.length
    const aVenir = activites.filter((a) => a.statut === 'A_VENIR').length
    const terminees = activites.filter((a) => a.statut === 'TERMINEE').length
    const totalParticipants = activites.reduce((sum, a) => sum + (a.nombreParticipants || 0), 0)
    return { total, aVenir, terminees, totalParticipants }
  }, [activites])

  const calendarEvents = useMemo(
    () =>
      activites
        .filter((a) => a.statut === 'A_VENIR')
        .map((a) => ({ id: String(a.id), title: a.titre, start: a.date })),
    [activites]
  )

  const galeriePhotos = useMemo(
    () => activites.filter((a) => a.photoUrl),
    [activites]
  )

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette activité ?')) return
    try {
      await activiteService.remove(id)
      toast.success('Activité supprimée')
      setActivites((prev) => prev.filter((a) => a.id !== id))
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const openCreate = () => {
    setEditingActivite(null)
    setShowModal(true)
  }

  const openEdit = (activite) => {
    setEditingActivite(activite)
    setShowModal(true)
  }

  return (
    <div className="pt-2">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-5">
        <div>
        <h2 className="font-heading text-xl font-semibold text-gray-800 dark:text-dark-text">Activités</h2>
        <p className="text-sm text-gray-500 dark:text-dark-text-muted mt-0.5">Événements et activités de l'association</p>
        </div>
        {canManage && (
  <button
    onClick={openCreate}
    className="flex items-center gap-2 h-10 px-4 rounded-button bg-primary text-white text-sm font-medium hover:brightness-110 transition"
  >
    <Plus size={17} strokeWidth={2} />
    Créer une activité
  </button>
)}
      </div>

      {/* Cartes stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      <div className="bg-white dark:bg-dark-surface rounded-card p-5 border border-black/5 dark:border-dark-border transition-colors">
          <div className="w-10 h-10 rounded-button flex items-center justify-center bg-secondary/10 text-secondary">
            <PartyPopper size={18} strokeWidth={1.75} />
          </div>
          <p className="text-gray-800 dark:text-dark-text">{stats.total}</p>
          <p className="text-gray-500 dark:text-dark-text-muted">Total des activités</p>
        </div>
        <div className="bg-white dark:bg-dark-surface rounded-card p-5 border border-black/5 dark:border-dark-border transition-colors">
          <div className="w-10 h-10 rounded-button flex items-center justify-center bg-success/10 text-success">
            <Clock size={18} strokeWidth={1.75} />
          </div>
          <p className="text-gray-800 dark:text-dark-text">{stats.aVenir}</p>
          <p className="text-gray-500 dark:text-dark-text-muted">À venir</p>
        </div>
        <div className="bg-white dark:bg-dark-surface rounded-card p-5 border border-black/5 dark:border-dark-border transition-colors">
          <div className="w-10 h-10 rounded-button flex items-center justify-center bg-gray-100 text-gray-500">
            <CheckCircle2 size={18} strokeWidth={1.75} />
          </div>
          <p className="text-gray-800 dark:text-dark-text">{stats.terminees}</p>
          <p className="text-gray-500 dark:text-dark-text-muted">Terminées</p>
        </div>
        <div className="bg-white dark:bg-dark-surface rounded-card p-5 border border-black/5 dark:border-dark-border transition-colors">
          <div className="w-10 h-10 rounded-button flex items-center justify-center bg-accent/10 text-accent">
            <Users size={18} strokeWidth={1.75} />
          </div>
          <p className="text-gray-800 dark:text-dark-text">{stats.totalParticipants}</p>
          <p className="text-gray-500 dark:text-dark-text-muted">Participants au total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Table premium */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-card border border-black/5 dark:border-dark-border overflow-hidden transition-colors">
          {/* Filtres */}
          <div className="p-4 border-b border-black/5 dark:border-dark-border flex flex-wrap gap-2.5">
            <div className="relative flex-1 min-w-[160px]">
              <Search size={15} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full h-9 pl-8 pr-3 rounded-button bg-gray-50 dark:bg-dark-surface-2 border border-black/5 dark:border-dark-border text-sm text-gray-800 dark:text-dark-text placeholder:text-gray-400 dark:placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
              />
            </div>
            <select
              value={filtreCategorie}
              onChange={(e) => setFiltreCategorie(e.target.value)}
              className="h-9 px-3 rounded-button bg-gray-50 dark:bg-dark-surface-2 border border-black/5 dark:border-dark-border text-sm text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
            >
              <option value="">Toutes catégories</option>
              {Object.entries(categorieLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="h-9 px-3 rounded-button bg-gray-50 dark:bg-dark-surface-2 border border-black/5 dark:border-dark-border text-sm text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
            >
              <option value="">Tous statuts</option>
              <option value="A_VENIR">À venir</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINEE">Terminée</option>
            </select>
            <input
              type="date"
              value={filtreDate}
              onChange={(e) => setFiltreDate(e.target.value)}
              className="h-9 px-3 rounded-button bg-gray-50 border border-black/5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
            />
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-gray-400 dark:text-dark-text-muted">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400 dark:text-dark-text-muted">Aucune activité trouvée</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
              <tr className="border-b border-black/5 dark:border-dark-border bg-gray-50/50 dark:bg-dark-surface-2">
              <th className="text-left font-medium text-gray-500 dark:text-dark-text-muted px-5 py-3">Activité</th>
                  <th className="text-left font-medium text-gray-500 dark:text-dark-text-muted px-5 py-3">Catégorie</th>
                  <th className="text-left font-medium text-gray-500 dark:text-dark-text-muted px-5 py-3">Statut</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b border-black/5 dark:border-dark-border last:border-0 hover:bg-gray-50/50 dark:hover:bg-dark-surface-2 transition-colors">
                    <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800 dark:text-dark-text">{a.titre}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400 dark:text-dark-text-muted mt-0.5">
                        <span className="flex items-center gap-1">
                          <CalendarIcon size={12} strokeWidth={1.75} />
                          {formatDate(a.date)}
                        </span>
                        {a.lieu && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} strokeWidth={1.75} />
                            {a.lieu}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users size={12} strokeWidth={1.75} />
                          {a.nombreParticipants}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categorieColors[a.categorie]}`}>
                        {categorieLabels[a.categorie]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statutConfig[a.statut].className}`}>
                        {statutConfig[a.statut].label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {canManage && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(a)}
                            className="w-8 h-8 rounded-button flex items-center justify-center text-gray-400 hover:text-secondary hover:bg-secondary/10 transition-colors"
                            title="Modifier"
                          >
                            <Pencil size={15} strokeWidth={1.75} />
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="w-8 h-8 rounded-button flex items-center justify-center text-gray-400 hover:text-error hover:bg-error/10 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={15} strokeWidth={1.75} />
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Calendrier */}
        <div className="bg-white dark:bg-dark-surface rounded-card border border-black/5 dark:border-dark-border p-4 fc-custom transition-colors">
        <p className="font-heading text-sm font-semibold text-gray-800 dark:text-dark-text mb-2 px-1">Activités à venir</p>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{ left: 'prev,next', center: 'title', right: '' }}
            height="auto"
            events={calendarEvents}
            locale="fr"
          />
        </div>
      </div>

      {/* Galerie photo */}
      {galeriePhotos.length > 0 && (
        <div className="bg-white dark:bg-dark-surface rounded-card border border-black/5 dark:border-dark-border p-5 transition-colors">
  <div className="flex items-center gap-2 mb-4">
    <ImageIcon size={16} strokeWidth={1.75} className="text-gray-500 dark:text-dark-text-muted" />
    <p className="font-heading text-base font-semibold text-gray-800 dark:text-dark-text">Galerie des événements</p>
  </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {galeriePhotos.map((a) => (
              <div key={a.id} className="relative aspect-square rounded-button overflow-hidden group">
                <img
                  src={a.photoUrl}
                  alt={a.titre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                  <p className="text-white text-xs font-medium truncate">{a.titre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <ActiviteFormModal
          activite={editingActivite}
          onClose={() => setShowModal(false)}
          onSaved={fetchActivites}
        />
      )}
    </div>
  )
}

export default Activites