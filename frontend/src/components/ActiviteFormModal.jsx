import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import { activiteService } from '../services/activiteService'
import { membreService } from '../services/membreService'

const categorieOptions = [
  { value: 'SPORT', label: 'Sport' },
  { value: 'CULTUREL', label: 'Culturel' },
  { value: 'ACADEMIQUE', label: 'Académique' },
  { value: 'SOCIAL', label: 'Social' },
  { value: 'CARITATIF', label: 'Caritatif' },
  { value: 'AUTRE', label: 'Autre' },
]

function ActiviteFormModal({ onClose, onSaved, activite }) {
  const [membres, setMembres] = useState([])
  const isEdition = !!activite

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: activite
      ? {
          titre: activite.titre,
          description: activite.description,
          categorie: activite.categorie,
          date: activite.date,
          heure: activite.heure,
          lieu: activite.lieu,
          responsableId: activite.responsableId || '',
          nombreParticipants: activite.nombreParticipants,
        }
      : {
          categorie: 'SOCIAL',
          nombreParticipants: 0,
        },
  })

  useEffect(() => {
    membreService.getAll().then(setMembres).catch(() => {
      toast.error('Impossible de charger les membres')
    })
  }, [])

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        responsableId: data.responsableId ? Number(data.responsableId) : null,
        nombreParticipants: Number(data.nombreParticipants) || 0,
      }
      if (isEdition) {
        await activiteService.update(activite.id, payload)
        toast.success('Activité modifiée')
      } else {
        await activiteService.create(payload)
        toast.success('Activité créée')
      }
      onSaved()
      onClose()
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de l'enregistrement"
      toast.error(message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-surface rounded-card w-full max-w-lg p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-lg font-semibold text-gray-800 dark:text-dark-text">
            {isEdition ? "Modifier l'activité" : 'Créer une activité'}
          </h3>
          <button onClick={onClose} className="text-gray-400 dark:text-dark-text-muted hover:text-gray-600 dark:hover:text-dark-text transition-colors">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-dark-text-muted mb-1.5">Titre</label>
            <input
              className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
              {...register('titre', { required: 'Requis' })}
            />
            {errors.titre && <p className="text-error text-xs mt-1">{errors.titre.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-dark-text-muted mb-1.5">Description</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition resize-none"
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-dark-text-muted mb-1.5">Catégorie</label>
              <select
                className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                {...register('categorie', { required: true })}
              >
                {categorieOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-dark-text-muted mb-1.5">Lieu</label>
              <input
                className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                {...register('lieu')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-dark-text-muted mb-1.5">Date</label>
              <input
                type="date"
                className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                {...register('date', { required: 'Requis' })}
              />
              {errors.date && <p className="text-error text-xs mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-dark-text-muted mb-1.5">Heure</label>
              <input
                type="time"
                className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                {...register('heure')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-dark-text-muted mb-1.5">Responsable</label>
              <select
                className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                {...register('responsableId')}
              >
                <option value="">Aucun</option>
                {membres.map((m) => (
                  <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-dark-text-muted mb-1.5">Participants prévus</label>
              <input
                type="number"
                min="0"
                className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                {...register('nombreParticipants')}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-button border border-black/10 dark:border-dark-border text-sm text-gray-600 dark:text-dark-text-muted hover:bg-black/5 dark:hover:bg-dark-surface-2 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 rounded-button bg-primary text-white text-sm font-medium hover:brightness-110 transition disabled:opacity-60"
            >
              {isSubmitting ? 'Enregistrement...' : isEdition ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ActiviteFormModal