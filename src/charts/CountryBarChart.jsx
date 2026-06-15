import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { RiGlobalLine, RiArrowRightLine, RiDownloadLine } from 'react-icons/ri'
import AllCountriesModal from '../components/AllCountriesModal'
import { useWaitlist } from '../context/WaitlistContext'
import { exportCountriesToCSV } from '../utils/exportCSV'

const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ec4899','#14b8a6','#a78bfa']

const DAY_MS = 86_400_000

// Local date sub-filter presets for the country breakdown
const RANGES = [
  { key: 'all', label: 'All',  days: null },
  { key: '7d',  label: '7d',   days: 7 },
  { key: '30d', label: '30d',  days: 30 },
  { key: '90d', label: '90d',  days: 90 },
]

// Aggregate country counts from a list of user rows, sorted desc
function aggregateCountries(users) {
  const map = {}
  users.forEach(u => { if (u.country) map[u.country] = (map[u.country] || 0) + 1 })
  return Object.entries(map)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
}

const FLAGS = {
  'India': '🇮🇳', 'United States': '🇺🇸', 'United Kingdom': '🇬🇧',
  'Brazil': '🇧🇷', 'Canada': '🇨🇦', 'Germany': '🇩🇪',
  'Australia': '🇦🇺', 'France': '🇫🇷', 'Singapore': '🇸🇬',
  'Japan': '🇯🇵', 'Netherlands': '🇳🇱', 'Mexico': '🇲🇽',
  'South Korea': '🇰🇷', 'Spain': '🇪🇸', 'Italy': '🇮🇹',
  'Sweden': '🇸🇪', 'Other': '🌍',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const flag = FLAGS[label] || ''
  return (
    <div className="glass-strong rounded-xl px-3 py-2 border border-white/10 shadow-xl">
      <p className="text-white/45 text-xs mb-0.5">{flag} {label}</p>
      <p className="text-white font-bold text-sm">{payload[0].value.toLocaleString()} users</p>
    </div>
  )
}

export default function CountryBarChart({ data = [], allData = [] }) {
  const { data: users } = useWaitlist()
  const [showModal, setShowModal] = useState(false)
  const [range, setRange]         = useState('all')

  // When a local range is active, recompute the breakdown from the raw user
  // rows; otherwise fall back to the pre-computed allData passed in.
  const agg = useMemo(() => {
    if (range === 'all') return allData
    const days   = RANGES.find(r => r.key === range)?.days
    const cutoff = Date.now() - days * DAY_MS
    return aggregateCountries(users.filter(u => new Date(u.createdAt).getTime() >= cutoff))
  }, [range, users, allData])

  const top8  = agg.slice(0, 8)
  const extra = agg.length - top8.length

  function handleExport() {
    if (!agg.length) {
      toast.error('No country data to export')
      return
    }
    const suffix = range === 'all' ? 'all-time' : range
    exportCountriesToCSV(agg, `countries-${suffix}.csv`)
    toast.success(`Exported ${agg.length} countries`)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl border p-5"
      >
        <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
              <RiGlobalLine size={12} className="text-indigo-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-sm whitespace-nowrap">Top Countries</h3>
              <p className="text-white/35 text-xs mt-0.5 whitespace-nowrap">User distribution by country</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Local date sub-filter */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.07]">
              {RANGES.map(r => (
                <button
                  key={r.key}
                  onClick={() => setRange(r.key)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                    range === r.key
                      ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/30'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Export country data */}
            <button
              onClick={handleExport}
              title="Export country data as CSV"
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-indigo-500/25 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/40 text-[11px] font-medium transition-all"
            >
              <RiDownloadLine size={12} />
              CSV
            </button>

            {extra > 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors group"
              >
                View All ({agg.length})
                <RiArrowRightLine
                  size={12}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            )}
          </div>
        </div>

        <div className="h-52">
          {!top8.length ? (
            <div className="h-full flex items-center justify-center text-white/20 text-sm">
              No country data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top8} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="country"
                  stroke="transparent"
                  tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 10 }}
                  tickLine={false}
                  tickFormatter={v => {
                    const flag = FLAGS[v] || ''
                    const short = v.length > 7 ? v.slice(0, 7) + '…' : v
                    return flag ? `${flag} ${short}` : short
                  }}
                />
                <YAxis
                  stroke="transparent"
                  tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" radius={[5, 5, 0, 0]} maxBarSize={40} animationDuration={600}>
                  {top8.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {showModal && (
        <AllCountriesModal data={agg} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
