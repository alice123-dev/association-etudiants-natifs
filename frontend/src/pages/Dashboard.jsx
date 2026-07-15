import { Users, Wallet, CalendarCheck, TrendingUp } from 'lucide-react'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from 'recharts'

const statCards = [
  {
    label: 'Total des membres',
    value: '248',
    icon: Users,
    accent: 'bg-secondary/10 text-secondary',
  },
  {
    label: 'Cotisations payées',
    value: '182',
    icon: Wallet,
    accent: 'bg-success/10 text-success',
  },
  {
    label: 'Réunions programmées',
    value: '5',
    icon: CalendarCheck,
    accent: 'bg-info/10 text-info',
  },
  {
    label: 'Nouveaux membres',
    value: '+12',
    icon: TrendingUp,
    accent: 'bg-accent/10 text-accent',
  },
]

const adhesionData = [
  { mois: 'Fév', membres: 180 },
  { mois: 'Mars', membres: 195 },
  { mois: 'Avr', membres: 210 },
  { mois: 'Mai', membres: 225 },
  { mois: 'Juin', membres: 236 },
  { mois: 'Juil', membres: 248 },
]

const dernieresCotisations = [
  { nom: 'Hery Rasoa', montant: '15 000 Ar', date: "Aujourd'hui, 14:20", statut: 'payé' },
  { nom: 'Naly Rabe', montant: '15 000 Ar', date: 'Hier, 09:10', statut: 'payé' },
  { nom: 'Tiana Andria', montant: '—', date: 'Il y a 2 jours', statut: 'impayé' },
]

function Dashboard() {
  return (
    <div className="pt-2 space-y-5">
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className="bg-white rounded-card p-5 border border-black/5"
          >
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
        {/* Graphique d'évolution */}
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
            <AreaChart data={adhesionData}>
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

        {/* Cotisations récentes */}
        <div className="bg-white rounded-card p-6 border border-black/5">
          <p className="text-sm text-gray-500">Récentes</p>
          <p className="font-heading text-base font-semibold text-gray-800 mb-4">
            Cotisations
          </p>
          <div className="space-y-4">
            {dernieresCotisations.map(({ nom, montant, date, statut }) => (
              <div key={nom} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{nom}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-800">{montant}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      statut === 'payé'
                        ? 'bg-success/10 text-success'
                        : 'bg-error/10 text-error'
                    }`}
                  >
                    {statut}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard