import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import { membreService } from '../services/membreService'

const roleBureauOptions = [
  { value: '', label: 'Membre simple' },
  { value: 'PRESIDENT', label: 'Président' },
  { value: 'VICE_PRESIDENT', label: 'Vice-président' },
  { value: 'SECRETAIRE', label: 'Secrétaire' },
  { value: 'TRESORIER', label: 'Trésorier' },
]

function MembreFormModal({ onClose, onCreated }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        roleBureau: data.roleBureau || null,
      }
      await membreService.create(payload)
      toast.success('Membre ajouté avec succès')
      onCreated()
      onClose()
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de l'ajout du membre"
      toast.error(message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-surface rounded-card w-full max-w-md p-6 shadow-lg">
        <div className="flex items-center justify-between mb-5">
        <h3 className="font-heading text-lg font-semibold text-gray-800 dark:text-dark-text">
  Ajouter un membre
</h3>
<button
  onClick={onClose}
  className="text-gray-400 dark:text-dark-text-muted hover:text-gray-600 dark:hover:text-dark-text transition-colors"
>
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-dark-text-muted">Nom</label>
              <input
                className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                {...register('nom', { required: 'Requis' })}
              />
              {errors.nom && <p className="text-error text-xs mt-1">{errors.nom.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-dark-text-muted">Prénom</label>
              <input
                className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                {...register('prenom', { required: 'Requis' })}
              />
              {errors.prenom && <p className="text-error text-xs mt-1">{errors.prenom.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-dark-text-muted">Email</label>
            <input
              type="email"
              className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
              {...register('email', { required: 'Requis' })}
            />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-dark-text-muted">Mot de passe initial</label>
            <input
              type="text"
              placeholder="Minimum 6 caractères"
              className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
              {...register('motDePasse', {
                required: 'Requis',
                minLength: { value: 6, message: 'Minimum 6 caractères' },
              })}
            />
            {errors.motDePasse && <p className="text-error text-xs mt-1">{errors.motDePasse.message}</p>}
            <p className="text-xs text-gray-400 dark:text-dark-text-muted mt-1">À communiquer au membre pour sa première connexion</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-dark-text-muted">Téléphone</label>
            <input
              className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
              {...register('telephone')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-dark-text-muted">Filière</label>
              <input
                className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                {...register('filiere')}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-dark-text-muted">Niveau</label>
              <input
                placeholder="Ex: L2"
               className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                {...register('niveauEtudes')}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-dark-text-muted">Rôle au bureau</label>
            <select
              className="w-full h-10 px-3 rounded-button border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition bg-white"
              {...register('roleBureau')}
            >
              {roleBureauOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
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
              {isSubmitting ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MembreFormModal