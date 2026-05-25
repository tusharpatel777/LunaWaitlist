import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiCloseLine, RiSearchLine, RiGlobalLine } from 'react-icons/ri'

const FLAGS = {
  'India': '🇮🇳', 'United States': '🇺🇸', 'United Kingdom': '🇬🇧',
  'Brazil': '🇧🇷', 'Canada': '🇨🇦', 'Germany': '🇩🇪',
  'Australia': '🇦🇺', 'France': '🇫🇷', 'Singapore': '🇸🇬',
  'Japan': '🇯🇵', 'Netherlands': '🇳🇱', 'Mexico': '🇲🇽',
  'South Korea': '🇰🇷', 'Spain': '🇪🇸', 'Italy': '🇮🇹',
  'Sweden': '🇸🇪', 'Norway': '🇳🇴', 'Denmark': '🇩🇰',
  'Finland': '🇫🇮', 'Poland': '🇵🇱', 'Russia': '🇷🇺',
  'China': '🇨🇳', 'Indonesia': '🇮🇩', 'Turkey': '🇹🇷',
  'Pakistan': '🇵🇰', 'Bangladesh': '🇧🇩', 'Nigeria': '🇳🇬',
  'South Africa': '🇿🇦', 'Egypt': '🇪🇬', 'Argentina': '🇦🇷',
  'Chile': '🇨🇱', 'Colombia': '🇨🇴', 'Other': '🌍',
}

const COLORS = [
  '#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b',
  '#ec4899','#14b8a6','#a78bfa','#f97316','#84cc16',
  '#e879f9','#22d3ee','#fb923c','#4ade80','#60a5fa','#f472b6',
]

export default function AllCountriesModal({ data = [], onClose }) {
  const [search, setSearch] = useState('')

  const total    = data.reduce((s, d) => s + d.count, 0)
  const filtered = search
    ? data.filter(d => d.country.toLowerCase().includes(search.toLowerCase()))
    : data

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="glass-strong rounded-2xl border border-white/[0.10] w-full max-w-lg flex flex-col"
          style={{ maxHeight: '82vh' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                <RiGlobalLine size={14} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm">All Countries</h2>
                <p className="text-white/35 text-[11px]">
                  {data.length} countries · {total.toLocaleString()} users
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <RiCloseLine size={18} />
            </button>
          </div>

          {/* Search */}
          <div className="px-5 py-3 border-b border-white/[0.04] flex-shrink-0">
            <div className="relative">
              <RiSearchLine
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                size={13}
              />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country…"
                className="w-full pl-8 pr-4 py-2 bg-white/[0.04] border border-white/[0.07] rounded-xl text-white/80 text-sm placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Country list */}
          <div className="overflow-y-auto flex-1 px-5 py-3 space-y-3">
            {filtered.length === 0 ? (
              <p className="text-white/25 text-sm text-center py-8">No countries match</p>
            ) : (
              filtered.map((item, idx) => {
                const globalRank = data.indexOf(item)
                const pct        = total ? (item.count / total * 100) : 0
                const color      = COLORS[globalRank % COLORS.length]
                const flag       = FLAGS[item.country] || '🌍'
                return (
                  <div key={item.country}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none">{flag}</span>
                        <span className="text-white/80 text-sm font-medium">{item.country}</span>
                        {globalRank < 3 && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-md font-bold"
                            style={{
                              color,
                              background: color + '22',
                              border: `1px solid ${color}44`,
                            }}
                          >
                            #{globalRank + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white/60 text-xs font-medium tabular-nums">
                          {item.count.toLocaleString()}
                        </span>
                        <span className="text-white/30 text-xs w-10 text-right tabular-nums">
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.35, delay: Math.min(idx * 0.02, 0.25) }}
                        className="h-full rounded-full"
                        style={{ background: color }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
