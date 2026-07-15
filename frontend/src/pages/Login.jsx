import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        motDePasse: data.motDePasse,
      })
      const { token, email, role } = response.data
      login(token, { email, role })
      toast.success('Connexion réussie')
      navigate('/')
    } catch (error) {
      toast.error("Email ou mot de passe incorrect")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-4xl bg-white rounded-[32px] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* Panneau illustration */}
        <div className="hidden lg:flex relative flex-col justify-between p-10 overflow-hidden bg-gradient-to-br from-background via-white to-secondary/10">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-secondary/20 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-accent/20 blur-2xl" />

          <div className="relative z-10 flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-heading font-semibold text-xs">AEN</span>
            </div>
            <span className="font-heading text-sm font-semibold text-gray-800">
              Étudiants Natifs
            </span>
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center py-10">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <div className="absolute inset-0 rounded-[40%_60%_60%_40%/40%_40%_60%_60%] bg-secondary/10" />
              <div className="relative w-28 h-28 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
                <GraduationCap size={48} strokeWidth={1.5} className="text-white" />
              </div>
              <div className="absolute top-4 right-2 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-accent" />
              </div>
              <div className="absolute bottom-6 left-0 w-6 h-6 rounded-full bg-secondary/30" />
            </div>
          </div>

          <div className="relative z-10">
            <p className="font-heading text-lg font-semibold text-gray-800 leading-snug">
              Bienvenue dans votre espace association
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Gérez les membres, cotisations, réunions et activités en un seul endroit.
            </p>
          </div>
        </div>

        {/* Panneau formulaire */}
        <div className="bg-primary p-10 flex flex-col justify-center">
          <h1 className="font-heading text-2xl font-semibold text-white mb-1">
            Connexion
          </h1>
          <p className="text-white/60 text-sm mb-8">
            Accédez à votre espace de gestion
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm text-white/80 mb-1.5">Adresse e-mail</label>
              <div className="relative">
                <Mail size={17} strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  placeholder="vous@email.com"
                  className="w-full h-11 pl-10 pr-3 rounded-button bg-white/10 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
                  {...register('email', { required: 'L\'email est obligatoire' })}
                />
              </div>
              {errors.email && (
                <p className="text-accent text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={17} strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 rounded-button bg-white/10 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
                  {...register('motDePasse', { required: 'Le mot de passe est obligatoire' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} strokeWidth={1.75} /> : <Eye size={17} strokeWidth={1.75} />}
                </button>
              </div>
              {errors.motDePasse && (
                <p className="text-accent text-xs mt-1">{errors.motDePasse.message}</p>
              )}
            </div>

            <div className="text-right">
              <a href="#" className="text-xs text-white/60 hover:text-white/90 transition-colors">
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-button bg-accent text-[#3A2110] font-medium text-sm hover:brightness-105 transition disabled:opacity-60"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-white/40 text-xs text-center mt-8">
            © 2026 Association des Étudiants Natifs
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login