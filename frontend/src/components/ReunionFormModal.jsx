import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import { reunionService } from '../services/reunionService'
import { membreService } from '../services/membreService'

function ReunionFormModal({ onClose, onCreated, defaultDate }) {
  const [membres, setMembres] = useState([])
  const [selectedMembres, setSelectedMembres] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      dateHeure: defaultDate || '',
    },
  })

  useEffect(() => {
    membreService.getAll().then(setMembres).catch(() => {
      toast.error('Impossible de charger les membres')
    })
  }, [])

  const toggleMembre = (id) => {
    setSelectedMembres((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const onSubmit = async (data) => {
    try {
      await reunionService.create({
        ...data,
        membreIds: selectedMembres,
      })
      toast.success('Réunion créée')
      onCreated()
      onClose()
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la création'
      toast.error(message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-surface rounded-card w-full max-w-lg p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-lg font-semibold text-gray-800 dark:text-dark-text">
            Planifier une réunion
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-dark-text-muted mb-1.5">Date et heure</label>
              <input
                type="datetime-local"
                className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                {...register('dateHeure', { required: 'Requis' })}
              />
              {errors.dateHeure && <p className="text-error text-xs mt-1">{errors.dateHeure.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-dark-text-muted mb-1.5">Lieu</label>
              <input
                placeholder="Salle B12"
                className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                {...register('lieu')}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-dark-text-muted mb-1.5">Description</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition resize-none"
              {...register('description')}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-dark-text-muted mb-1.5">Ordre du jour</label>
            <textarea
              rows={3}
              placeholder="1. Point budget&#10;2. Prochaine activité..."
              className="w-full px-3 py-2 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition resize-none"
              {...register('ordreDuJour')}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-gray-500 dark:text-dark-text-muted">
                Participants ({selectedMembres.length} sélectionné{selectedMembres.length > 1 ? 's' : ''})
              </label>
              <button
                type="button"
                onClick={() =>
                  setSelectedMembres(
                    selectedMembres.length === membres.length ? [] : membres.map((m) => m.id)
                  )
                }
                className="text-xs text-secondary hover:underline"
              >
                {selectedMembres.length === membres.length ? 'Tout désélectionner' : 'Tout sélectionner'}
              </button>
            </div>
            <div className="border border-black/10 dark:border-dark-border rounded-button max-h-40 overflow-y-auto divide-y divide-black/5 dark:divide-dark-border">
              {membres.map((m) => (
                <label
                  key={m.id}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-surface-2 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembres.includes(m.id)}
                    onChange={() => toggleMembre(m.id)}
                    className="rounded border-black/20 text-secondary focus:ring-secondary/30"
                  />
                  {m.prenom} {m.nom}
                </label>
              ))}
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
              {isSubmitting ? 'Création...' : 'Créer la réunion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReunionFormModal