import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, GraduationCap, ArrowRight, Users, Wallet, CalendarDays, PartyPopper, BookOpen, Award, Clock, TrendingUp } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

// ─── Floating Icon Component ──────────────────────────────────────
const FloatingIcon = ({ icon: Icon, className, delay = 0, duration = 3 }) => (
  <div 
    className={`absolute flex items-center justify-center rounded-2xl bg-white dark:bg-[#1A1D29] shadow-lg shadow-black/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 ${className}`}
    style={{ 
      animation: `float ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`
    }}
  >
    <Icon size={20} strokeWidth={1.5} className="text-emerald-500 dark:text-emerald-400" />
  </div>
)

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
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
    <div className="min-h-screen bg-[#F5F3EE] dark:bg-[#0F1117] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-700">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(12px) rotate(-2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>

      <div className="w-full max-w-5xl bg-white dark:bg-[#161922] rounded-[28px] shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-gray-100 dark:border-gray-800">

        {/* ─── Left Panel ─── */}
        <div className="hidden lg:flex relative flex-col justify-between p-10 overflow-hidden bg-gradient-to-br from-[#F5F3EE] via-white to-emerald-50/60 dark:from-[#0F1117] dark:via-[#13151F] dark:to-emerald-950/20">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-emerald-400/8 dark:bg-emerald-500/10 blur-3xl" style={{ animation: 'pulse-glow 6s ease-in-out infinite' }} />
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-teal-400/8 dark:bg-teal-500/10 blur-3xl" style={{ animation: 'pulse-glow 8s ease-in-out infinite', animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-emerald-300/5 dark:bg-emerald-400/5 blur-3xl" style={{ animation: 'pulse-glow 7s ease-in-out infinite', animationDelay: '1s' }} />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-xs tracking-wider">AEN</span>
            </div>
            <div>
              <span className="text-gray-900 dark:text-white font-bold text-sm tracking-tight">Association</span>
              <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-medium tracking-wider uppercase">Étudiants Natifs</span>
            </div>
          </div>

          {/* Illustration Zone */}
          <div className="relative z-10 flex-1 flex items-center justify-center py-8">
            <div className="relative w-72 h-72">
              {/* Central element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  {/* Glow ring */}
                  <div className="absolute inset-0 -m-6 rounded-[40%_60%_60%_40%/40%_40%_60%_60%] bg-emerald-400/10 dark:bg-emerald-500/10 animate-[pulse-glow_4s_ease-in-out_infinite]" />

                  {/* Main card */}
                  <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/25 dark:shadow-emerald-500/15">
                    <GraduationCap size={48} strokeWidth={1.5} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Floating icons */}
              <FloatingIcon 
                icon={Users} 
                className="w-12 h-12 top-4 left-4" 
                delay={0} 
                duration={3.5}
              />
              <FloatingIcon 
                icon={Wallet} 
                className="w-10 h-10 top-8 right-8" 
                delay={0.5} 
                duration={4}
              />
              <FloatingIcon 
                icon={CalendarDays} 
                className="w-11 h-11 bottom-16 left-6" 
                delay={1} 
                duration={3.8}
              />
              <FloatingIcon 
                icon={PartyPopper} 
                className="w-10 h-10 bottom-8 right-12" 
                delay={1.5} 
                duration={4.2}
              />
              <FloatingIcon 
                icon={BookOpen} 
                className="w-9 h-9 top-1/2 -left-2" 
                delay={0.8} 
                duration={3.2}
              />
              <FloatingIcon 
                icon={Award} 
                className="w-9 h-9 top-1/2 -right-2" 
                delay={1.2} 
                duration={3.6}
              />
              <FloatingIcon 
                icon={Clock} 
                className="w-8 h-8 bottom-2 left-1/2 -translate-x-1/2" 
                delay={2} 
                duration={4}
              />
              <FloatingIcon 
                icon={TrendingUp} 
                className="w-8 h-8 top-2 left-1/2 -translate-x-1/2" 
                delay={1.8} 
                duration={3.4}
              />

              {/* Small decorative dots */}
              <div className="absolute top-12 right-20 w-3 h-3 rounded-full bg-emerald-400/30 dark:bg-emerald-500/30" style={{ animation: 'float 5s ease-in-out infinite', animationDelay: '0.3s' }} />
              <div className="absolute bottom-20 left-20 w-2 h-2 rounded-full bg-teal-400/40 dark:bg-teal-500/30" style={{ animation: 'float-reverse 4s ease-in-out infinite', animationDelay: '0.7s' }} />
              <div className="absolute top-1/2 right-4 w-2.5 h-2.5 rounded-full bg-emerald-300/30 dark:bg-emerald-400/20" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '1.1s' }} />
            </div>
          </div>

          {/* Bottom text */}
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
              Bienvenue dans votre espace association
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              Gérez les membres, cotisations, réunions et activités en un seul endroit. Une plateforme moderne pour votre association.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-5">
              {['Membres', 'Cotisations', 'Réunions', 'Activités'].map((item) => (
                <span 
                  key={item} 
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-[11px] font-semibold text-gray-600 dark:text-gray-400 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Right Panel (Form) ─── */}
        <div className="bg-white dark:bg-[#161922] p-8 sm:p-10 flex flex-col justify-center relative">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xs tracking-wider">AEN</span>
            </div>
            <div>
              <span className="text-gray-900 dark:text-white font-bold text-sm">Association</span>
              <span className="block text-[10px] text-emerald-600 font-medium">Étudiants Natifs</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Connexion
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
              Accédez à votre espace de gestion
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Adresse e-mail
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.01]' : ''}`}>
                <Mail 
                  size={17} 
                  strokeWidth={1.75} 
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'}`} 
                />
                <input
                  type="email"
                  placeholder="vous@email.com"
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full h-12 pl-11 pr-4 rounded-xl bg-gray-50 dark:bg-[#13151F] border text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none transition-all duration-300 ${
                    errors.email 
                      ? 'border-red-300 dark:border-red-500/30 focus:border-red-400 focus:ring-4 focus:ring-red-500/10' 
                      : focusedField === 'email'
                        ? 'border-emerald-300 dark:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/10 shadow-lg shadow-emerald-500/5'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                  {...register('email', { required: "L'email est obligatoire" })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 animate-in slide-in-from-top-1">
                  <span className="w-1 h-1 rounded-full bg-red-500" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.01]' : ''}`}>
                <Lock 
                  size={17} 
                  strokeWidth={1.75} 
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'}`} 
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full h-12 pl-11 pr-11 rounded-xl bg-gray-50 dark:bg-[#13151F] border text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none transition-all duration-300 ${
                    errors.motDePasse 
                      ? 'border-red-300 dark:border-red-500/30 focus:border-red-400 focus:ring-4 focus:ring-red-500/10' 
                      : focusedField === 'password'
                        ? 'border-emerald-300 dark:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/10 shadow-lg shadow-emerald-500/5'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                  {...register('motDePasse', { required: 'Le mot de passe est obligatoire' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {showPassword ? <EyeOff size={17} strokeWidth={1.75} /> : <Eye size={17} strokeWidth={1.75} />}
                </button>
              </div>
              {errors.motDePasse && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 animate-in slide-in-from-top-1">
                  <span className="w-1 h-1 rounded-full bg-red-500" />
                  {errors.motDePasse.message}
                </p>
              )}
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-md border-gray-300 text-emerald-500 focus:ring-emerald-500/20" />
                <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                Mot de passe oublié ?
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 disabled:shadow-none transition-all duration-300 overflow-hidden"
            >
              <span className={`absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700`} />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center">
              © 2026 Association des Étudiants Natifs. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login