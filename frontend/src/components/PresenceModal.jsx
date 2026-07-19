import { X, Check, XCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { reunionService } from '../services/reunionService'

function PresenceModal({ reunion, onClose, onUpdated }) {
  const handleToggle = async (participantId, currentPresent) => {
    try {
      await reunionService.updatePresence(participantId, !currentPresent)
      onUpdated()
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-surface rounded-card w-full max-w-md p-6 shadow-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-heading text-lg font-semibold text-gray-800 dark:text-dark-text">
            Feuille de présence
          </h3>
          <button onClick={onClose} className="text-gray-400 dark:text-dark-text-muted hover:text-gray-600 dark:hover:text-dark-text transition-colors">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-dark-text-muted mb-5">{reunion.titre}</p>

        {reunion.participants.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-dark-text-muted text-center py-6">Aucun participant invité</p>
        ) : (
          <div className="space-y-2">
            {reunion.participants.map((p) => (
              <div
                key={p.participantId}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-button border border-black/5 dark:border-dark-border"
              >
                <span className="text-sm text-gray-800 dark:text-dark-text">{p.membreNomComplet}</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleToggle(p.participantId, p.present)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      p.present
                        ? 'bg-success text-white'
                        : 'bg-gray-100 dark:bg-dark-surface-2 text-gray-400 dark:text-dark-text-muted hover:bg-success/15 hover:text-success'
                    }`}
                    title="Présent"
                  >
                    <Check size={15} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => handleToggle(p.participantId, p.present)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      !p.present
                        ? 'bg-error text-white'
                        : 'bg-gray-100 dark:bg-dark-surface-2 text-gray-400 dark:text-dark-text-muted hover:bg-error/15 hover:text-error'
                    }`}
                    title="Absent"
                  >
                    <XCircle size={15} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PresenceModal