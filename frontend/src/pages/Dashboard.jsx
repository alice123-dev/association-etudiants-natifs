import { useState, useEffect } from 'react'
import { Users, Wallet, CalendarCheck, TrendingUp } from 'lucide-react'
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
            .slice(0, 4)
        )
      } catch (error) {
        toast.error('Impossible de charger les statistiques')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !stats) {
    return (
      <div className="pt-2">
        <div className="bg-white rounded-card border border-black/5 p-10 text-center text-sm text-gray-400">
          Chargement du tableau de bord...
        </div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total des membres',
      value: stats.totalMembres,
      icon: Users,
      accent: 'bg-secondary/10 text-secondary',
    },
    {
      label: 'Cotisations payées ce mois',
      value: stats.cotisationsPayeesMoisCourant,
      icon: Wallet,
      accent: 'bg-success/10 text-success',
    },
    {
      label: 'Réunions à venir',
      value: stats.reunionsAVenir,
      icon: CalendarCheck,
      accent: 'bg-info/10 text-info',
    },
    {
      label: 'Nouveaux membres (30j)',
      value: `+${stats.nouveauxMembres}`,
      icon: TrendingUp,
      accent: 'bg-accent/10 text-accent',
    },
  ]

  return (
    <div className="pt-2 space-y-5">
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="bg-white rounded-card p-5 border border-black/5">
            <div className={`w-10 h-10 rounded-button flex items-center justify-center ${accent}`}>
              <Icon size={18} strokeWidth={1.75} />
            </div>
            <p className="text-2xl font-semibold text-gray-800 mt-4">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Graphique + Cotisations récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-card p-6 border border-black/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Évolution</p>
              <p className="font-heading text-base font-semibold text-gray-800">
                Adhésions sur 6 mois
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.evolutionAdhesions}>
              <defs>
                <linearGradient id="colorMembres" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1D6F6A" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#1D6F6A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="mois"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  fontSize: '13px',
                }}
              />
              <Area
                type="monotone"
                dataKey="membres"
                stroke="#1D6F6A"
                strokeWidth={2}
                fill="url(#colorMembres)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-card p-6 border border-black/5">
          <p className="text-sm text-gray-500">Récentes</p>
          <p className="font-heading text-base font-semibold text-gray-800 mb-4">
            Cotisations
          </p>
          {dernieresCotisations.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Aucune cotisation enregistrée</p>
          ) : (
            <div className="space-y-4">
              {dernieresCotisations.map((c) => (
                <div key={c.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{c.membreNomComplet}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.datePaiement}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-800">
                      {new Intl.NumberFormat('fr-FR').format(c.montant)} Ar
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                      payé
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard