import { useState, useEffect, useMemo } from 'react'
import { Plus, Wallet, TrendingUp, AlertCircle, Trash2, Calendar } from 'lucide-react'
import { toast } from 'react-toastify'
import { cotisationService } from '../services/cotisationService'
import CotisationFormModal from '../components/CotisationFormModal'

const modeLabels = {
  ESPECES: 'Espèces',
  MVOLA: 'Mvola',
  ORANGE_MONEY: 'Orange Money',
  AIRTEL_MONEY: 'Airtel Money',
}

const modeColors = {
  ESPECES: 'bg-gray-100 text-gray-600',
  MVOLA: 'bg-secondary/10 text-secondary',
  ORANGE_MONEY: 'bg-accent/10 text-accent',
  AIRTEL_MONEY: 'bg-info/10 text-info',
}

function formatMontant(montant) {
  return new Intl.NumberFormat('fr-FR').format(montant) + ' Ar'
}

function Cotisations() {
  const [cotisations, setCotisations] = useState([])
  const [impayes, setImpayes] = useState([])
  const [periode, setPeriode] = useState(String(new Date().getFullYear()))
  const [loading, setLoading] = useState(true)
  const [loadingImpayes, setLoadingImpayes] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchCotisations = async () => {
    setLoading(true)
    try {
      const data = await cotisationService.getAll()
      setCotisations(data)
    } catch (error) {
      toast.error('Impossible de charger les cotisations')
    } finally {
      setLoading(false)
    }
  }

  const fetchImpayes = async (p) => {
    setLoadingImpayes(true)
    try {
      const data = await cotisationService.getImpayes(p)
      setImpayes(data)
    } catch (error) {
      toast.error('Impossible de charger les impayés')
    } finally {
      setLoadingImpayes(false)
    }
  }

  useEffect(() => {
    fetchCotisations()
  }, [])

  useEffect(() => {
    fetchImpayes(periode)
  }, [periode])

  const totalCollecte = useMemo(
    () => cotisations.reduce((sum, c) => sum + c.montant, 0),
    [cotisations]
  )

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette cotisation ?')) return
    try {
      await cotisationService.remove(id)
      toast.success('Cotisation supprimée')
      setCotisations((prev) => prev.filter((c) => c.id !== id))
      fetchImpayes(periode)
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleCreated = () => {
    fetchCotisations()
    fetchImpayes(periode)
  }

  return (
    <div className="pt-2">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-heading text-xl font-semibold text-gray-800">Cotisations</h2>
          <p className="text-sm text-gray-500 mt-0.5">Suivi des paiements de l'association</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 h-10 px-4 rounded-button bg-primary text-white text-sm font-medium hover:brightness-110 transition"
        >
          <Plus size={17} strokeWidth={2} />
          Enregistrer un paiement
        </button>
      </div>

      {/* Cartes stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-card p-5 border border-black/5">
          <div className="w-10 h-10 rounded-button flex items-center justify-center bg-success/10 text-success">
            <Wallet size={18} strokeWidth={1.75} />
          </div>
          <p className="text-2xl font-semibold text-gray-800 mt-4">{formatMontant(totalCollecte)}</p>
          <p className="text-sm text-gray-500 mt-0.5">Total collecté</p>
        </div>
        <div className="bg-white rounded-card p-5 border border-black/5">
          <div className="w-10 h-10 rounded-button flex items-center justify-center bg-secondary/10 text-secondary">
            <TrendingUp size={18} strokeWidth={1.75} />
          </div>
          <p className="text-2xl font-semibold text-gray-800 mt-4">{cotisations.length}</p>
          <p className="text-sm text-gray-500 mt-0.5">Paiements enregistrés</p>
        </div>
        <div className="bg-white rounded-card p-5 border border-black/5">
          <div className="w-10 h-10 rounded-button flex items-center justify-center bg-error/10 text-error">
            <AlertCircle size={18} strokeWidth={1.75} />
          </div>
          <p className="text-2xl font-semibold text-gray-800 mt-4">{impayes.length}</p>
          <p className="text-sm text-gray-500 mt-0.5">Impayés ({periode})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tableau des paiements */}
        <div className="lg:col-span-2 bg-white rounded-card border border-black/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-black/5">
            <p className="font-heading text-base font-semibold text-gray-800">Historique des paiements</p>
          </div>
          {loading ? (
            <div className="p-10 text-center text-sm text-gray-400">Chargement...</div>
          ) : cotisations.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400">Aucun paiement enregistré</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-gray-50/50">
                  <th className="text-left font-medium text-gray-500 px-5 py-3">Membre</th>
                  <th className="text-left font-medium text-gray-500 px-5 py-3">Montant</th>
                  <th className="text-left font-medium text-gray-500 px-5 py-3">Période</th>
                  <th className="text-left font-medium text-gray-500 px-5 py-3">Mode</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {cotisations
                  .slice()
                  .sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement))
                  .map((c) => (
                    <tr key={c.id} className="border-b border-black/5 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-800">{c.membreNomComplet}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.datePaiement}</p>
                      </td>
                      <td className="px-5 py-3.5 text-gray-800 font-medium">{formatMontant(c.montant)}</td>
                      <td className="px-5 py-3.5 text-gray-600">{c.periodeLibelle}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${modeColors[c.modePaiement]}`}>
                          {modeLabels[c.modePaiement]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-gray-300 hover:text-error transition-colors"
                        >
                          <Trash2 size={16} strokeWidth={1.75} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Impayés */}
        <div className="bg-white rounded-card border border-black/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-heading text-base font-semibold text-gray-800">Impayés</p>
            <div className="relative">
              <Calendar size={14} strokeWidth={1.75} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                className="w-24 h-8 pl-7 pr-2 rounded-button border border-black/10 text-xs focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
              />
            </div>
          </div>

          {loadingImpayes ? (
            <p className="text-sm text-gray-400 text-center py-6">Chargement...</p>
          ) : impayes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Aucun impayé pour cette période 🎉</p>
          ) : (
            <div className="space-y-3">
              {impayes.map((m) => (
                <div key={m.membreId} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{m.nomComplet}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.email || '—'}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-error/10 text-error font-medium">
                    Impayé
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <CotisationFormModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}

export default Cotisations