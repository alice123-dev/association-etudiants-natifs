import { useState, useRef, useEffect } from 'react'
import {
  User, Building2, Bell, Palette, Info, Camera, Shield,
  Moon, Sun, Mail, Phone, MapPin, Lock, Check, Calendar,
  ShieldCheck, Sparkles, ArrowUpRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { profilService } from '../services/profilService'
import { toast } from 'react-toastify'


const roleLabels = {
  ADMINISTRATEUR: 'Administrateur',
  BUREAU: 'Bureau',
  MEMBRE: 'Membre',
}

const tabs = [
  { id: 'profil', label: 'Mon profil', icon: User },
  { id: 'association', label: 'Association', icon: Building2 },
  { id: 'securite', label: 'Sécurité', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'apparence', label: 'Apparence', icon: Palette },
  { id: 'apropos', label: 'À propos', icon: Info },
]

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors shrink-0 ${
        checked ? 'bg-secondary justify-end' : 'bg-gray-200 dark:bg-dark-surface-2 justify-start'
      }`}
    >
      <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
    </button>
  )
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="w-10 h-10 rounded-button bg-secondary/10 dark:bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <div>
        <p className="font-heading text-base font-semibold text-gray-800 dark:text-dark-text">{title}</p>
        <p className="text-xs text-gray-400 dark:text-dark-text-muted mt-0.5">{description}</p>
      </div>
    </div>
  )
}

function InputField({ icon: Icon, label, ...props }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-dark-text-muted mb-1.5">
        {Icon && <Icon size={12} strokeWidth={1.75} />}
        {label}
      </label>
      <input
        className="w-full h-10 px-3 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition disabled:opacity-60"
        {...props}
      />
    </div>
  )
}

function Parametres() {
  const { user } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState('profil')
  const [notifs, setNotifs] = useState({
    nouvellesReunions: true,
    nouvellesActivites: true,
    nouvellesAnnonces: true,
    rappelsCotisations: false,
  })
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)
  useEffect(() => {
    profilService.getProfil().then((data) => {
      if (data.photoUrl) {
        setPhotoPreview(`http://localhost:8080${data.photoUrl}`)
      }
    }).catch(() => {})
  }, [])
  const toggleNotif = (key) => {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
  
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Le fichier ne doit pas dépasser 2 Mo')
      return
    }
  
    // Aperçu immédiat pendant l'upload
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result)
    reader.readAsDataURL(file)
  
    try {
      const result = await profilService.uploadPhoto(file)
      setPhotoPreview(`http://localhost:8080${result.photoUrl}`)
      toast.success('Photo mise à jour')
    } catch (error) {
      toast.error("Erreur lors de l'envoi de la photo")
    }
  }

  const initiales = user?.email?.[0]?.toUpperCase() ?? '?'
  const roleLabel = roleLabels[user?.role] ?? user?.role

  return (
    <div className="pt-2">
      <div className="mb-5">
        <h2 className="font-heading text-xl font-semibold text-gray-800 dark:text-dark-text">Paramètres</h2>
        <p className="text-sm text-gray-500 dark:text-dark-text-muted mt-0.5">Gérez votre compte et les préférences de l'application</p>
      </div>

      {/* Bannière profil */}
      <div className="relative bg-primary rounded-card p-6 mb-4 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute bottom-0 right-24 w-24 h-24 rounded-full bg-accent/10" />

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/15 text-white flex items-center justify-center text-xl font-semibold border-2 border-white/20 overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt="Photo de profil" className="w-full h-full object-cover" />
                ) : (
                  initiales
                )}
              </div>
              <button
                onClick={handlePhotoClick}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent text-[#3A2110] flex items-center justify-center shadow-sm hover:brightness-105 transition"
              >
                <Camera size={12} strokeWidth={2} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold text-white">{user?.email?.split('@')[0]}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-xs text-white/70">
                  <Mail size={12} strokeWidth={1.75} />
                  {user?.email}
                </span>
                <span className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
                  <Shield size={11} strokeWidth={1.75} />
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pr-2">
            <div className="text-center">
              <p className="text-white font-heading text-lg font-semibold">Actif</p>
              <p className="text-white/50 text-xs mt-0.5">Statut</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-white font-heading text-lg font-semibold">2026</p>
              <p className="text-white/50 text-xs mt-0.5">Membre depuis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Navigation par onglets */}
        <div className="xl:col-span-3 bg-white dark:bg-dark-surface rounded-card border border-black/5 dark:border-dark-border p-2 h-fit transition-colors">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-button text-sm transition-colors mb-0.5 last:mb-0 ${
                activeTab === id
                  ? 'bg-primary text-white font-medium'
                  : 'text-gray-600 dark:text-dark-text-muted hover:bg-black/5 dark:hover:bg-dark-surface-2'
              }`}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div className="xl:col-span-6 bg-white dark:bg-dark-surface rounded-card border border-black/5 dark:border-dark-border p-6 transition-colors">

          {/* --- Mon profil --- */}
          {activeTab === 'profil' && (
            <div>
              <SectionHeader icon={User} title="Informations personnelles" description="Modifiez votre nom et vos coordonnées" />

              <div className="grid grid-cols-2 gap-4 mb-4">
                <InputField label="Nom" placeholder="Votre nom" />
                <InputField label="Prénom" placeholder="Votre prénom" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <InputField icon={Mail} label="Email" defaultValue={user?.email} disabled />
                <InputField icon={Phone} label="Téléphone" placeholder="+261 34 00 000 00" />
              </div>

              <button className="h-10 px-5 rounded-button bg-primary text-white text-sm font-medium hover:brightness-110 transition">
                Enregistrer les modifications
              </button>

              <div className="border-t border-black/5 dark:border-dark-border mt-6 pt-6">
                <p className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-dark-text mb-1">
                  <Calendar size={14} strokeWidth={1.75} />
                  Informations du compte
                </p>
                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 dark:text-dark-text-muted mb-1">Rôle</p>
                    <p className="text-gray-800 dark:text-dark-text font-medium">{roleLabel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-dark-text-muted mb-1">Membre depuis</p>
                    <p className="text-gray-800 dark:text-dark-text font-medium">—</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-dark-text-muted mb-1">Dernière connexion</p>
                    <p className="text-gray-800 dark:text-dark-text font-medium">Aujourd'hui</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- Association --- */}
          {activeTab === 'association' && (
            <div>
              <SectionHeader icon={Building2} title="Informations de l'association" description="Ces informations apparaissent sur les documents générés" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-card bg-primary flex items-center justify-center text-white font-heading font-semibold">
                  AEN
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-text">Logo de l'association</p>
                  <button className="text-xs text-secondary hover:underline mt-1">Changer le logo</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <InputField label="Nom de l'association" defaultValue="Association des Étudiants Natifs" />
                <InputField icon={Mail} label="Email de contact" defaultValue="contact@aen.mg" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <InputField icon={Phone} label="Téléphone" placeholder="+261 34 00 000 00" />
                <InputField icon={MapPin} label="Adresse" placeholder="Campus universitaire..." />
              </div>

              <div className="mb-6">
                <label className="block text-xs text-gray-500 dark:text-dark-text-muted mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Présentation de l'association..."
                  className="w-full px-3 py-2 rounded-button border border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface-2 text-gray-800 dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition resize-none"
                />
              </div>

              <button className="h-10 px-5 rounded-button bg-primary text-white text-sm font-medium hover:brightness-110 transition">
                Enregistrer les modifications
              </button>
            </div>
          )}

          {/* --- Sécurité --- */}
          {activeTab === 'securite' && (
            <div>
              <SectionHeader icon={Lock} title="Mot de passe" description="Modifiez votre mot de passe régulièrement pour sécuriser votre compte" />

              <div className="grid grid-cols-2 gap-4 max-w-md mb-4">
                <InputField type="password" label="Mot de passe actuel" />
                <InputField type="password" label="Nouveau mot de passe" />
              </div>
              <button className="h-10 px-5 rounded-button border border-black/10 dark:border-dark-border text-gray-700 dark:text-dark-text-muted text-sm font-medium hover:bg-black/5 dark:hover:bg-dark-surface-2 transition">
                Modifier le mot de passe
              </button>
            </div>
          )}

          {/* --- Notifications --- */}
          {activeTab === 'notifications' && (
            <div>
              <SectionHeader icon={Bell} title="Préférences de notifications" description="Choisissez les notifications que vous souhaitez recevoir" />

              <div className="space-y-1">
                {[
                  { key: 'nouvellesReunions', label: 'Nouvelles réunions', desc: 'Être notifié quand une réunion est planifiée' },
                  { key: 'nouvellesActivites', label: 'Nouvelles activités', desc: 'Être notifié quand une activité est créée' },
                  { key: 'nouvellesAnnonces', label: 'Nouvelles annonces', desc: 'Être notifié des publications importantes' },
                  { key: 'rappelsCotisations', label: 'Rappels de cotisations', desc: 'Recevoir un rappel avant échéance' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3.5 border-b border-black/5 dark:border-dark-border last:border-0 hover:bg-black/[0.02] dark:hover:bg-dark-surface-2 -mx-2 px-2 rounded-button transition-colors">
                    <div>
                      <p className="text-sm text-gray-800 dark:text-dark-text">{label}</p>
                      <p className="text-xs text-gray-400 dark:text-dark-text-muted mt-0.5">{desc}</p>
                    </div>
                    <ToggleSwitch checked={notifs[key]} onChange={() => toggleNotif(key)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- Apparence --- */}
          {activeTab === 'apparence' && (
            <div>
              <SectionHeader icon={Palette} title="Apparence" description="Personnalisez l'apparence de l'application" />

              <div className="flex items-center justify-between py-3 hover:bg-black/[0.02] dark:hover:bg-dark-surface-2 -mx-2 px-2 rounded-button transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-button bg-gray-100 dark:bg-dark-surface-2 flex items-center justify-center text-gray-500 dark:text-dark-text-muted">
                    {darkMode ? <Moon size={16} strokeWidth={1.75} /> : <Sun size={16} strokeWidth={1.75} />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 dark:text-dark-text">Mode sombre</p>
                    <p className="text-xs text-gray-400 dark:text-dark-text-muted mt-0.5">Bascule entre thème clair et sombre</p>
                  </div>
                </div>
                <ToggleSwitch checked={darkMode} onChange={toggleDarkMode} />
              </div>

              <div className="border-t border-black/5 dark:border-dark-border mt-4 pt-5">
                <p className="text-sm text-gray-800 dark:text-dark-text mb-3">Couleur d'accentuation</p>
                <div className="flex gap-2.5">
                  {[
                    { color: '#0F3D3E', name: 'Teal (actuel)' },
                    { color: '#D97B3F', name: 'Terracotta' },
                    { color: '#2C6E8F', name: 'Bleu' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      title={c.name}
                      className="w-9 h-9 rounded-full border-2 border-white dark:border-dark-surface shadow-sm ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center hover:scale-105 transition-transform"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.color === '#0F3D3E' && <Check size={14} strokeWidth={2.5} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- À propos --- */}
          {activeTab === 'apropos' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-card bg-primary flex items-center justify-center text-white font-heading font-semibold">
                  AEN
                </div>
                <div>
                  <p className="font-heading text-base font-semibold text-gray-800 dark:text-dark-text">
                    Association des Étudiants Natifs
                  </p>
                  <p className="text-xs text-gray-400 dark:text-dark-text-muted mt-0.5">Version 1.0.0</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-dark-text-muted leading-relaxed mb-6">
                Application de gestion associative permettant de gérer les membres, cotisations,
                réunions, activités et communications de l'association, développée dans le cadre
                d'un projet académique de Licence 3 Informatique.
              </p>

              <div className="border-t border-black/5 dark:border-dark-border pt-5">
                <p className="text-sm font-medium text-gray-800 dark:text-dark-text mb-2">Stack technique</p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Vite', 'Spring Boot', 'PostgreSQL', 'Tailwind CSS', 'JWT'].map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-secondary/10 dark:bg-secondary/15 text-secondary font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-black/5 dark:border-dark-border mt-5 pt-5">
                <p className="text-sm font-medium text-gray-800 dark:text-dark-text mb-1">Développeur</p>
                <p className="text-xs text-gray-500 dark:text-dark-text-muted">Steven — Étudiant en Licence 3 Informatique</p>
              </div>
            </div>
          )}

        </div>

        {/* Colonne latérale droite */}
        <div className="xl:col-span-3 space-y-4">
          {/* Sécurité du compte */}
          <div className="bg-white dark:bg-dark-surface rounded-card border border-black/5 dark:border-dark-border p-5 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={16} strokeWidth={1.75} className="text-success" />
              <p className="text-sm font-semibold text-gray-800 dark:text-dark-text">Sécurité du compte</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-dark-text-muted">Mot de passe</span>
                <span className="text-success font-medium">Sécurisé</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-dark-text-muted">Authentification</span>
                <span className="text-success font-medium">JWT actif</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-dark-text-muted">Dernière connexion</span>
                <span className="text-gray-700 dark:text-dark-text font-medium">Aujourd'hui</span>
              </div>
            </div>
          </div>

          {/* Conseil / astuce */}
          <div className="bg-secondary/5 dark:bg-secondary/10 rounded-card border border-secondary/10 dark:border-secondary/20 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} strokeWidth={1.75} className="text-secondary" />
              <p className="text-sm font-semibold text-gray-800 dark:text-dark-text">Astuce</p>
            </div>
            <p className="text-xs text-gray-600 dark:text-dark-text-muted leading-relaxed">
              Activez le mode sombre pour un confort visuel optimal lors d'une utilisation prolongée,
              notamment en soirée.
            </p>
          </div>

          {/* Lien support */}
          <div className="bg-white dark:bg-dark-surface rounded-card border border-black/5 dark:border-dark-border p-5 transition-colors">
            <p className="text-sm font-semibold text-gray-800 dark:text-dark-text mb-1">Besoin d'aide ?</p>
            <p className="text-xs text-gray-400 dark:text-dark-text-muted mb-3">
              Contactez le bureau de l'association pour toute question.
            </p>
            <a
              href="mailto:contact@aen.mg"
              className="flex items-center gap-1 text-xs text-secondary font-medium hover:underline"
            >
              contact@aen.mg
              <ArrowUpRight size={12} strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Parametres