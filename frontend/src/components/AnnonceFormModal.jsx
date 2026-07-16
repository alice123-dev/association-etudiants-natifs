import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import { annonceService } from '../services/annonceService'

function AnnonceFormModal({ onClose, onCreated }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { type: 'INFORMATION', epinglee: false },
  })

  const onSubmit = async (data) => {
    try {
      await annonceService.create(data)
      toast.success('Annonce publiée')
      onCreated()
      onClose()
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la publication'
      toast.error(message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-card w-full max-w-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-lg font-semibold text-gray-800">
            Publier une annonce
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Titre</label>
            <input
              className="w-full h-10 px-3 rounded-button border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
              {...register('titre', { required: 'Requis' })}
            />
            {errors.titre && <p className="text-error text-xs mt-1">{errors.titre.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Contenu</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 rounded-button border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition resize-none"
              {...register('contenu', { required: 'Requis' })}
            />
            {errors.contenu && <p className="text-error text-xs mt-1">{errors.contenu.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Type</label>
            <select
              className="w-full h-10 px-3 rounded-button border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition bg-white"
              {...register('type', { required: true })}
            >
              <option value="INFORMATION">Information</option>
              <option value="URGENT">Urgent</option>
              <option value="EVENEMENT">Événement</option>
            </select>
          </div>

          <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-black/20 text-secondary focus:ring-secondary/30"
              {...register('epinglee')}
            />
            Épingler en haut de la liste
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-button border border-black/10 text-sm text-gray-600 hover:bg-black/5 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 rounded-button bg-primary text-white text-sm font-medium hover:brightness-110 transition disabled:opacity-60"
            >
              {isSubmitting ? 'Publication...' : 'Publier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AnnonceFormModal