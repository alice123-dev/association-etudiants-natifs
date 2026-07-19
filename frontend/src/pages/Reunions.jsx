import { useState, useEffect, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Plus, MapPin, Users, Clock, ClipboardList, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { reunionService } from '../services/reunionService'
import ReunionFormModal from '../components/ReunionFormModal'
import PresenceModal from '../components/PresenceModal'
import { useAuth } from '../context/AuthContext'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function formatHeure(dateStr) {
  return new Date(dateStr).toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit',
  })
}

function Reunions() {
  const { canManage } = useAuth()
  const [reunions, setReunions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [presenceReunion, setPresenceReunion] = useState(null)
  const [defaultDate, setDefaultDate] = useState('')

  const fetchReunions = async () => {
    setLoading(true)
    try {
      const data = await reunionService.getAll()
      setReunions(data)
    } catch (error) {
      toast.error('Impossible de charger les réunions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReunions()
  }, [])

  const events = useMemo(
    () =>
      reunions.map((r) => ({
        id: String(r.id),
        title: r.titre,
        start: r.dateHeure,
      })),
    [reunions]
  )

  const sortedReunions = useMemo(
    () => reunions.slice().sort((a, b) => new Date(a.dateHeure) - new Date(b.dateHeure)),
    [reunions]
  )

  const isPassed = (dateHeure) => new Date(dateHeure) < new Date()

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette réunion ?')) return
    try {
      await reunionService.remove(id)
      toast.success('Réunion supprimée')
      setReunions((prev) => prev.filter((r) => r.id !== id))
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleDateClick = (info) => {
    setDefaultDate(info.dateStr + 'T18:00')
    setShowModal(true)
  }

  const refreshPresenceReunion = async () => {
    const updated = await reunionService.getById(presenceReunion.id)
    setPresenceReunion(updated)
    fetchReunions()
  }

  return (
    <div className="pt-2">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-5">
        <div>
        <h2 className="font-heading text-xl font-semibold text-gray-800 dark:text-dark-text">Réunions</h2>
        <p className="text-sm text-gray-500 dark:text-dark-text-muted mt-0.5">
            {reunions.length} réunion{reunions.length > 1 ? 's' : ''} planifiée{reunions.length > 1 ? 's' : ''}
          </p>
        </div>
        {canManage && (
  <button
    onClick={() => { setDefaultDate(''); setShowModal(true) }}
    className="flex items-center gap-2 h-10 px-4 rounded-button bg-primary text-white text-sm font-medium hover:brightness-110 transition"
  >
    <Plus size={17} strokeWidth={2} />
    Planifier une réunion
  </button>
)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Calendrier */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-card border border-black/5 dark:border-dark-border p-4 fc-custom transition-colors">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{ left: 'prev,next', center: 'title', right: '' }}
            height="auto"
            events={events}
            dateClick={handleDateClick}
            locale="fr"
            buttonText={{ today: "Aujourd'hui" }}
          />
        </div>

        {/* Table premium */}
        <div className="lg:col-span-3 bg-white dark:bg-dark-surface rounded-card border border-black/5 dark:border-dark-border overflow-hidden transition-colors">
  <div className="px-5 py-4 border-b border-black/5 dark:border-dark-border">
    <p className="font-heading text-base font-semibold text-gray-800 dark:text-dark-text">Liste des réunions</p>
  </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-gray-400 dark:text-dark-text-muted">Chargement...</div>
          ) : sortedReunions.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400 dark:text-dark-text-muted">Aucune réunion planifiée</div>
          ) : (
            <div className="divide-y divide-black/5 dark:divide-dark-border">
              {sortedReunions.map((r) => (
                <div key={r.id} className="px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-dark-surface-2 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5">
                      <p className="font-medium text-gray-800 dark:text-dark-text truncate">{r.titre}</p>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0 ${
                            isPassed(r.dateHeure)
                              ? 'bg-gray-100 dark:bg-dark-surface-2 text-gray-500 dark:text-dark-text-muted'
                              : 'bg-success/10 text-success'
                          }`}
                        >
                          {isPassed(r.dateHeure) ? 'Terminée' : 'À venir'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-dark-text-muted">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} strokeWidth={1.75} className="text-gray-400" />
                          {formatDate(r.dateHeure)} · {formatHeure(r.dateHeure)}
                        </div>
                        {r.lieu && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} strokeWidth={1.75} className="text-gray-400" />
                            {r.lieu}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Users size={13} strokeWidth={1.75} className="text-gray-400" />
                          {r.participants.length} participant{r.participants.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    {canManage && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setPresenceReunion(r)}
                          className="w-8 h-8 rounded-button flex items-center justify-center text-gray-400 hover:text-secondary hover:bg-secondary/10 transition-colors"
                          title="Feuille de présence"
                        >
                          <ClipboardList size={16} strokeWidth={1.75} />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="w-8 h-8 rounded-button flex items-center justify-center text-gray-400 hover:text-error hover:bg-error/10 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} strokeWidth={1.75} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <ReunionFormModal
          onClose={() => setShowModal(false)}
          onCreated={fetchReunions}
          defaultDate={defaultDate}
        />
      )}

      {presenceReunion && (
        <PresenceModal
          reunion={presenceReunion}
          onClose={() => setPresenceReunion(null)}
          onUpdated={refreshPresenceReunion}
        />
      )}
    </div>
  )
}

export default Reunions