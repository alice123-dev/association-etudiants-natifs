import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import { cotisationService } from '../services/cotisationService'
import { membreService } from '../services/membreService'

const modePaiementOptions = [
  { value: 'ESPECES', label: 'Espèces' },
  { value: 'MVOLA', label: 'Mvola' },
  { value: 'ORANGE_MONEY', label: 'Orange Money' },
  { value: 'AIRTEL_MONEY', label: 'Airtel Money' },
]

function CotisationFormModal({ onClose, onCreated }) {
  const [membres, setMembres] = useState([])
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      montant: 15000,
      typePeriode: 'ANNUELLE',
      datePaiement: new Date().toISOString().split('T')[0],
    },
  })

  const typePeriode = watch('typePeriode')

  useEffect(() => {
    membreService.getAll().then(setMembres).catch(() => {
      toast.error('Impossible de charger les membres')
    })
  }, [])

  const onSubmit = async (data) => {
    try {
      await cotisationService.create({
        ...data,
        membreId: Number(data.membreId),
        montant: Number(data.montant),
      })
      toast.success('Paiement enregistré')
      onCreated()
      onClose()
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de l'enregistrement"
      toast.error(message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-card w-full max-w-md p-6 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-lg font-semibold text-gray-800">
            Enregistrer un paiement
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Membre</label>
            <select
              className="w-full h-10 px-3 rounded-button border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition bg-white"
              {...register('membreId', { required: 'Requis' })}
            >
              <option value="">Sélectionner un membre</option>
              {membres.map((m) => (
                <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>
              ))}
            </select>
            {errors.membreId && <p className="text-error text-xs mt-1">{errors.membreId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Montant (Ar)</label>
              <input
                type="number"
                className="w-full h-10 px-3 rounded-button border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                {...register('montant', { required: 'Requis', min: { value: 1, message: 'Doit être positif' } })}
              />
              {errors.montant && <p className="text-error text-xs mt-1">{errors.montant.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Type</label>
              <select
                className="w-full h-10 px-3 rounded-button border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition bg-white"
                {...register('typePeriode', { required: true })}
              >
                <option value="ANNUELLE">Annuelle</option>
                <option value="MENSUELLE">Mensuelle</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              Période ({typePeriode === 'ANNUELLE' ? 'ex: 2026' : 'ex: Juillet 2026'})
            </label>
            <input
              placeholder={typePeriode === 'ANNUELLE' ? '2026' : 'Juillet 2026'}
              className="w-full h-10 px-3 rounded-button border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
              {...register('periodeLibelle', { required: 'Requis' })}
            />
            {errors.periodeLibelle && <p className="text-error text-xs mt-1">{errors.periodeLibelle.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Mode de paiement</label>
              <select
                className="w-full h-10 px-3 rounded-button border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition bg-white"
                {...register('modePaiement', { required: true })}
              >
                {modePaiementOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Date</label>
              <input
                type="date"
                className="w-full h-10 px-3 rounded-button border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                {...register('datePaiement', { required: 'Requis' })}
              />
            </div>
          </div>

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
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CotisationFormModal