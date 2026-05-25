import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { RiGlobalLine, RiArrowRightLine } from 'react-icons/ri'
import AllCountriesModal from '../components/AllCountriesModal'

const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ec4899','#14b8a6','#a78bfa']

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
  const [showModal, setShowModal] = useState(false)
  const top8 = data.slice(0, 8)
  const extra = allData.length - top8.length

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl border p-5"
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
              <RiGlobalLine size={12} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Top Countries</h3>
              <p className="text-white/35 text-xs mt-0.5">User distribution by country</p>
            </div>
          </div>

          {extra > 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors group"
            >
              View All ({allData.length})
              <RiArrowRightLine
                size={12}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          )}
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
        <AllCountriesModal data={allData} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
