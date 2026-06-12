import { motion } from 'framer-motion'
import { RiCalendarLine, RiCloseLine } from 'react-icons/ri'
import { useWaitlist } from '../context/WaitlistContext'

const DAY_MS = 86_400_000

const PRESETS = [
  { key: 'all',   label: 'All Time', days: null },
  { key: 'today', label: 'Today',    days: 0 },
  { key: '7d',    label: '7 Days',   days: 6 },
  { key: '30d',   label: '30 Days',  days: 29 },
  { key: '90d',   label: '90 Days',  days: 89 },
]

function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const inputCls =
  'px-2.5 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/70 text-xs ' +
  'focus:outline-none focus:border-indigo-500/50 transition-colors'

// Global date filter bar — state lives in WaitlistContext so it applies to every view
export default function DateRangeFilter() {
  const { data, totalCount, dateFilter, setDateFilter } = useWaitlist()
  const active = dateFilter.from || dateFilter.to

  function applyPreset(p) {
    if (p.days === null) {
      setDateFilter({ preset: 'all', from: '', to: '' })
      return
    }
    const today = new Date()
    setDateFilter({
      preset: p.key,
      from:   iso(new Date(today.getTime() - p.days * DAY_MS)),
      to:     iso(today),
    })
  }

  function setCustom(field, value) {
    setDateFilter(prev => ({ ...prev, preset: 'custom', [field]: value }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl border px-3 py-2 flex flex-wrap items-center gap-2"
    >
      <RiCalendarLine size={14} className="text-white/30 flex-shrink-0" />

      {/* Presets */}
      <div className="flex items-center gap-1">
        {PRESETS.map(p => (
          <button
            key={p.key}
            onClick={() => applyPreset(p)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              dateFilter.preset === p.key
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'text-white/45 hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-white/10 hidden sm:block" />

      {/* Custom range */}
      <div className="flex items-center gap-1.5">
        <input
          type="date"
          value={dateFilter.from}
          max={dateFilter.to || undefined}
          onChange={e => setCustom('from', e.target.value)}
          className={inputCls}
          style={{ colorScheme: 'dark' }}
        />
        <span className="text-white/25 text-xs">–</span>
        <input
          type="date"
          value={dateFilter.to}
          min={dateFilter.from || undefined}
          onChange={e => setCustom('to', e.target.value)}
          className={inputCls}
          style={{ colorScheme: 'dark' }}
        />
      </div>

      {/* Active filter summary + clear */}
      {active && (
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-white/35 text-xs tabular-nums">
            {data.length.toLocaleString()} of {totalCount.toLocaleString()} users
          </span>
          <button
            onClick={() => applyPreset(PRESETS[0])}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 hover:text-white text-xs font-medium transition-colors"
          >
            <RiCloseLine size={12} /> Clear
          </button>
        </div>
      )}
    </motion.div>
  )
}
