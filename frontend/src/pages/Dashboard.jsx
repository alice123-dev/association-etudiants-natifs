import { useState, useEffect } from 'react'
import { 
  Users, 
  Wallet, 
  CalendarCheck, 
  TrendingUp, 
  ArrowUpRight,
  Activity,
  CreditCard,
  UserPlus,
  Clock,
  ChevronRight
} from 'lucide-react'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from 'recharts'
import { toast } from 'react-toastify'
import { dashboardService } from '../services/dashboardService'
import { cotisationService } from '../services/cotisationService'

// ─── Skeleton Loader ──────────────────────────────────────────────
const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />
)

const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-[#151922] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
    <div className="flex items-start justify-between">
      <SkeletonPulse className="w-11 h-11 rounded-xl" />
      <SkeletonPulse className="w-16 h-6 rounded-md" />
    </div>
    <SkeletonPulse className="w-24 h-8 mt-4 rounded-md" />
    <SkeletonPulse className="w-32 h-4 mt-2 rounded-md" />
  </div>
)

const ChartSkeleton = () => (
  <div className="bg-white dark:bg-[#151922] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
    <SkeletonPulse className="w-48 h-5 mb-2 rounded-md" />
    <SkeletonPulse className="w-32 h-4 mb-6 rounded-md" />
    <SkeletonPulse className="w-full h-[220px] rounded-xl" />
  </div>
)

const ListSkeleton = () => (
  <div className="bg-white dark:bg-[#151922] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
    <SkeletonPulse className="w-32 h-5 mb-2 rounded-md" />
    <SkeletonPulse className="w-24 h-4 mb-6 rounded-md" />
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <SkeletonPulse className="w-9 h-9 rounded-full" />
          <div>
            <SkeletonPulse className="w-32 h-4 rounded-md" />
            <SkeletonPulse className="w-20 h-3 mt-1 rounded-md" />
          </div>
        </div>
        <div className="text-right">
          <SkeletonPulse className="w-16 h-4 rounded-md" />
          <SkeletonPulse className="w-12 h-3 mt-1 rounded-md" />
        </div>
      </div>
    ))}
  </div>
)

// ─── Custom Tooltip for Chart ─────────────────────────────────────
const CustomChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-white dark:bg-[#1E2230] border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/20 px-4 py-3 backdrop-blur-sm">
      <p className="text-xs font-medium text-gray-400 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {payload[0].value} <span className="text-gray-400 dark:text-gray-500 font-normal">membres</span>
      </p>
    </div>
  )
}

// ─── Stat Card Component ──────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, trendValue, color, index }) => {
  const colorVariants = {
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-500/15',
      icon: 'text-emerald-600 dark:text-emerald-400',
      border: 'group-hover:border-emerald-200 dark:group-hover:border-emerald-500/30',
      glow: 'group-hover:shadow-emerald-500/10',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-500/15',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'group-hover:border-blue-200 dark:group-hover:border-blue-500/30',
      glow: 'group-hover:shadow-blue-500/10',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-500/15',
      icon: 'text-amber-600 dark:text-amber-400',
      border: 'group-hover:border-amber-200 dark:group-hover:border-amber-500/30',
      glow: 'group-hover:shadow-amber-500/10',
    },
    violet: {
      bg: 'bg-violet-50 dark:bg-violet-500/15',
      icon: 'text-violet-600 dark:text-violet-400',
      border: 'group-hover:border-violet-200 dark:group-hover:border-violet-500/30',
      glow: 'group-hover:shadow-violet-500/10',
    },
  }

  const cv = colorVariants[color] || colorVariants.emerald

  return (
    <div 
      className={`group relative bg-white dark:bg-[#151922] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-lg ${cv.glow} hover:-translate-y-0.5 ${cv.border}`}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl ${cv.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={20} strokeWidth={1.75} className={cv.icon} />
        </div>
        {trendValue && (
          <div className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15">
            <ArrowUpRight size={12} strokeWidth={2.5} />
            {trendValue}
          </div>
        )}
      </div>

      <div className="mt-5">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {value}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
          {label}
        </p>
      </div>
    </div>
  )
}

// ─── Empty State Component ────────────────────────────────────────
const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800/70 flex items-center justify-center mb-3">
      <Icon size={22} className="text-gray-400 dark:text-gray-400" />
    </div>
    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</p>
  </div>
)

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [dernieresCotisations, setDernieresCotisations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, cotisationsData] = await Promise.all([
          dashboardService.getStats(),
          cotisationService.getAll(),
        ])
        setStats(statsData)
        setDernieresCotisations(
          cotisationsData
            .slice()
            .sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement))
            .slice(0, 5)
        )
      } catch (error) {
        toast.error('Impossible de charger les statistiques')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ─── Loading State ──────────────────────────────────────────────
  if (loading || !stats) {
    return (
      <div className="w-full">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {[1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)}
        </div>

        {/* Chart + List Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2"><ChartSkeleton /></div>
          <div><ListSkeleton /></div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total des membres',
      value: new Intl.NumberFormat('fr-FR').format(stats.totalMembres),
      icon: Users,
      trendValue: '+12%',
      color: 'emerald',
    },
    {
      label: 'Cotisations ce mois',
      value: new Intl.NumberFormat('fr-FR').format(stats.cotisationsPayeesMoisCourant),
      icon: Wallet,
      trendValue: '+8%',
      color: 'blue',
    },
    {
      label: 'Réunions à venir',
      value: stats.reunionsAVenir,
      icon: CalendarCheck,
      trendValue: '+2',
      color: 'amber',
    },
    {
      label: 'Nouveaux membres (30j)',
      value: `+${stats.nouveauxMembres}`,
      icon: TrendingUp,
      trendValue: '+24%',
      color: 'violet',
    },
  ]

  // Format currency
  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR').format(montant)
  }

  // Format date relative
  const formatDateRelative = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return 'Hier'
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Avatar color based on name
  const getAvatarColor = (name) => {
    const colors = [
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
      'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
      'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
      'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
      'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
      'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300',
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className="w-full">
      {/* ─── Stat Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {statCards.map((card, index) => (
          <StatCard key={card.label} {...card} index={index} />
        ))}
      </div>

      {/* ─── Main Content Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ─── Chart Card ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-white dark:bg-[#151922] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20">
          {/* Card Header */}
          <div className="px-6 pt-6 pb-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={14} className="text-emerald-500" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Évolution
                  </p>
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Adhésions sur 6 mois
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Croissance des nouveaux membres par mois
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Membres</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart 
                data={stats.evolutionAdhesions} 
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorMembres" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="50%" stopColor="#10B981" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMembresLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="mois"
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fontSize: 12, 
                    fill: '#9CA3AF',
                    fontWeight: 500 
                  }}
                  dy={8}
                />
                <Tooltip 
                  content={<CustomChartTooltip />}
                  cursor={{ 
                    stroke: '#10B981', 
                    strokeWidth: 1, 
                    strokeDasharray: '4 4',
                    opacity: 0.3 
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="membres"
                  stroke="url(#colorMembresLine)"
                  strokeWidth={2.5}
                  fill="url(#colorMembres)"
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ─── Recent Cotisations Card ─────────────────────────────── */}
        <div className="bg-white dark:bg-[#151922] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20 flex flex-col">
          {/* Card Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard size={14} className="text-blue-500" />
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Récentes
              </p>
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Cotisations
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Derniers paiements enregistrés
            </p>
          </div>

          {/* List Content */}
          <div className="px-6 pb-6 flex-1">
            {dernieresCotisations.length === 0 ? (
              <EmptyState 
                icon={Wallet} 
                title="Aucune cotisation"
                description="Les paiements apparaîtront ici une fois enregistrés"
              />
            ) : (
              <div className="space-y-1">
                {dernieresCotisations.map((c, index) => (
                  <div 
                    key={c.id} 
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-200 cursor-default"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarColor(c.membreNomComplet)}`}>
                      {getInitials(c.membreNomComplet)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {c.membreNomComplet}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock size={11} className="text-gray-400 dark:text-gray-500" />
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDateRelative(c.datePaiement)}
                        </p>
                      </div>
                    </div>

                    {/* Amount & Status */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {formatMontant(c.montant)} <span className="text-xs font-normal text-gray-400 dark:text-gray-500">Ar</span>
                      </p>
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        Payé
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View All Link */}
            {dernieresCotisations.length > 0 && (
              <button className="w-full mt-4 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-200 group/btn">
                Voir toutes les cotisations
                <ChevronRight size={14} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Quick Actions Bar (Bottom) ───────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button className="group flex items-center gap-4 p-4 bg-white dark:bg-[#151922] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-md transition-all duration-300 text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <UserPlus size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Nouveau membre</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Ajouter un adhérent</p>
          </div>
        </button>

        <button className="group flex items-center gap-4 p-4 bg-white dark:bg-[#151922] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md transition-all duration-300 text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Wallet size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Enregistrer un paiement</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Nouvelle cotisation</p>
          </div>
        </button>

        <button className="group flex items-center gap-4 p-4 bg-white dark:bg-[#151922] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-500/30 hover:shadow-md transition-all duration-300 text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <CalendarCheck size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Planifier une réunion</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Nouvel événement</p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default Dashboard