import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { User, Phone, GraduationCap, Lock, Mail, Shield } from 'lucide-react'
import { toast } from 'react-toastify'
import { profilService } from '../services/profilService'

const roleLabels = {
  ADMINISTRATEUR: 'Administrateur',
  BUREAU: 'Bureau',
  MEMBRE: 'Membre',
}

function Profil() {
  const [profil, setProfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savingInfo, setSavingInfo] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const infoForm = useForm()
  const passwordForm = useForm()

  useEffect(() => {
    profilService.getProfil()
      .then((data) => {
        setProfil(data)
        infoForm.reset({
          telephone: data.telephone || '',
          filiere: data.filiere || '',
          niveauEtudes: data.niveauEtudes || '',
        })
      })
      .catch(() => toast.error('Impossible de charger le profil'))
      .finally(() => setLoading(false))
  }, [])

  const onSubmitInfo = async (data) => {
    setSavingInfo(true)
    try {
      const updated = await profilService.updateProfil(data)
      setProfil(updated)
      toast.success('Profil mis à jour')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setSavingInfo(false)
    }
  }

  const onSubmitPassword = async (data) => {
    setSavingPassword(true)
    try {
      await profilService.changePassword(data)
      toast.success('Mot de passe modifié')
      passwordForm.reset()
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors du changement de mot de passe'
      toast.error(message)
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading || !profil) {
    return (
      <div className="pt-2">
        <div className="bg-white rounded-card border border-black/5 p-10 text-center text-sm text-gray-400">
          Chargement du profil...
        </div>
      </div>
    )
  }

  const initiales = profil.email[0].toUpperCase()

  return (
    <div className="pt-2">
      <div className="mb-5">
        <h2 className="font-heading text-xl font-semibold text-gray-800">Mon profil</h2>
        <p className="text-sm text-gray-500 mt-0.5">Gérez vos informations personnelles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-4xl">
        {/* Carte identité */}
        <div className="bg-white rounded-card border border-black/5 p-6 flex flex-col items-center text-center h-fit">
          <div className="w-20 h-20 rounded-full bg-secondary text-white flex items-center justify-center text-2xl font-semibold">
            {initiales}
          </div>
          <p className="font-heading font-semibold text-gray-800 mt-4">
            {profil.prenom ? `${profil.prenom} ${profil.nom}` : profil.email}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
            <Mail size={13} strokeWidth={1.75} />
            {profil.email}
          </div>
          <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium mt-3">
            <Shield size={12} strokeWidth={1.75} />
            {roleLabels[profil.role]}
          </span>
        </div>

        {/* Formulaires */}
        <div className="lg:col-span-2 space-y-4">
          {/* Infos personnelles */}
          <div className="bg-white rounded-card border border-black/5 p-6">
            <p className="font-heading text-base font-semibold text-gray-800 mb-4">
              Informations personnelles
            </p>
            <form onSubmit={infoForm.handleSubmit(onSubmitInfo)} className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
                  <Phone size={13} strokeWidth={1.75} />
                  Téléphone
                </label>
                <input
                  className="w-full h-10 px-3 rounded-button border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                  {...infoForm.register('telephone')}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
                    <GraduationCap size={13} strokeWidth={1.75} />
                    Filière
                  </label>
                  <input
                    className="w-full h-10 px-3 rounded-button border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                    {...infoForm.register('filiere')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Niveau</label>
                  <input
                    className="w-full h-10 px-3 rounded-button border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                    {...infoForm.register('niveauEtudes')}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={savingInfo}
                className="h-10 px-5 rounded-button bg-primary text-white text-sm font-medium hover:brightness-110 transition disabled:opacity-60"
              >
                {savingInfo ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </form>
          </div>

          {/* Changer mot de passe */}
          <div className="bg-white rounded-card border border-black/5 p-6">
            <p className="font-heading text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Lock size={16} strokeWidth={1.75} />
              Changer le mot de passe
            </p>
            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Ancien mot de passe</label>
                <input
                  type="password"
                  className="w-full h-10 px-3 rounded-button border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                  {...passwordForm.register('ancienMotDePasse', { required: 'Requis' })}
                />
                {passwordForm.formState.errors.ancienMotDePasse && (
                  <p className="text-error text-xs mt-1">{passwordForm.formState.errors.ancienMotDePasse.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Nouveau mot de passe</label>
                <input
                  type="password"
                  className="w-full h-10 px-3 rounded-button border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition"
                  {...passwordForm.register('nouveauMotDePasse', {
                    required: 'Requis',
                    minLength: { value: 6, message: 'Minimum 6 caractères' },
                  })}
                />
                {passwordForm.formState.errors.nouveauMotDePasse && (
                  <p className="text-error text-xs mt-1">{passwordForm.formState.errors.nouveauMotDePasse.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="h-10 px-5 rounded-button bg-primary text-white text-sm font-medium hover:brightness-110 transition disabled:opacity-60"
              >
                {savingPassword ? 'Modification...' : 'Modifier le mot de passe'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profil