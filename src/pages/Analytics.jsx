import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiBarChartLine, RiGroupLine, RiCalendarLine,
  RiCloseLine, RiShareLine, RiUserStarLine,
  RiTimeLine, RiCalendarCheckLine,
} from 'react-icons/ri'
import { useWaitlist } from '../context/WaitlistContext'
import StatCard from '../components/StatCard'
import CountryBarChart from '../charts/CountryBarChart'
import DevicePieChart from '../charts/DevicePieChart'
import DailySignupsChart from '../charts/DailySignupsChart'
import UserTable from '../components/UserTable'
import { StatCardSkeleton, ChartSkeleton } from '../components/SkeletonLoader'
import { formatNumber } from '../utils/formatters'

// ─── Range configuration ────────────────────────────────────────────────────
const RANGES = [
  { key: 'Today', label: 'Today',    icon: RiTimeLine },
  { key: '7d',    label: '7 Days',   icon: null },
  { key: '14d',   label: '14 Days',  icon: null },
  { key: '30d',   label: '30 Days',  icon: null },
  { key: '90d',   label: '90 Days',  icon: null },
  { key: 'All',   label: 'All Time', icon: null },
]

function fmt(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getRangeData(range, stats) {
  const now    = new Date()
  const nowIso = now.toISOString().slice(0, 10)

  if (range === 'Today') {
    const chartData = stats.hourlyData.map(h => ({ date: h.time, users: h.users }))
    return {
      chartData,
      tableData:      [...chartData].reverse(),
      subtitle:       `${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} — hourly`,
      chartTitle:     'Hourly Signups',
      enableDrilldown: false,
      periodLabel:    'Hour',
      xKey:           'date',
      total:          stats.todayUsers,
    }
  }

  if (range === 'All') {
    const d = stats.monthlyData
    return {
      chartData:       d,
      tableData:       [...d].reverse(),
      subtitle:        `All time — ${d.length} month${d.length !== 1 ? 's' : ''}`,
      chartTitle:      'Monthly Signups',
      enableDrilldown: false,
      periodLabel:     'Month',
      xKey:            'date',
      total:           stats.totalUsers,
    }
  }

  const days = range === '7d' ? 7 : range === '14d' ? 14 : range === '30d' ? 30 : 90

  let chartData
  if (days <= 30) {
    // Use gap-filled dailyData for short ranges
    chartData = stats.dailyData.slice(-days)
  } else {
    // Use allDailyData filtered for longer ranges
    const cutoff = new Date(now - (days - 1) * 86_400_000).toISOString().slice(0, 10)
    chartData    = stats.allDailyData.filter(d => d.isoDate >= cutoff)
  }

  const start = new Date(now - (days - 1) * 86_400_000)
  return {
    chartData,
    tableData:       [...chartData].reverse(),
    subtitle:        `${fmt(start)} – ${fmt(now)}`,
    chartTitle:      'Daily Signups',
    enableDrilldown: true,
    periodLabel:     'Date',
    xKey:            'date',
    total:           chartData.reduce((s, d) => s + d.users, 0),
  }
}

// ─── Source distribution ────────────────────────────────────────────────────
function SourceList({ data = [] }) {
  if (!data.length) return (
    <div className="glass rounded-2xl border p-5">
      <h3 className="text-white font-semibold text-sm mb-4">Traffic Sources</h3>
      <p className="text-white/25 text-sm">No source data available</p>
    </div>
  )
  const total  = data.reduce((s, d) => s + d.value, 0)
  const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ec4899','#14b8a6']
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass rounded-2xl border p-5"
    >
      <h3 className="text-white font-semibold text-sm mb-4">Traffic Sources</h3>
      <div className="space-y-3">
        {data.slice(0, 7).map((item, i) => {
          const pct = total ? Math.round(item.value / total * 100) : 0
          return (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/60 text-xs">{item.name}</span>
                <span className="text-white/50 text-xs tabular-nums">
                  {formatNumber(item.value)} ({pct}%)
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="h-full rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Referral leaderboard ───────────────────────────────────────────────────
function ReferralLeaderboard({ referrers = [], totalReferred = 0, referralRate = 0 }) {
  if (!referrers.length) return null
  const RANK_COLORS = ['#f59e0b','#9ca3af','#b45309']
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl border p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
            <RiUserStarLine size={12} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Top Referrers</h3>
            <p className="text-white/35 text-xs">
              {totalReferred.toLocaleString()} referred · {referralRate}% rate
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-emerald-400">
          <RiShareLine size={13} />
          <span className="text-xs font-semibold">{referralRate}%</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {referrers.map((r, i) => (
          <div key={r.code} className="flex items-center gap-3">
            <span
              className="text-xs font-bold w-5 text-center"
              style={{ color: i < 3 ? RANK_COLORS[i] : 'rgba(255,255,255,0.25)' }}
            >
              #{i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs truncate">{r.email}</p>
              <p className="text-white/30 text-[10px] font-mono mt-0.5">{r.code}</p>
            </div>
            <span className="text-indigo-400 font-bold text-sm tabular-nums">{r.count}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Day drill-down panel ───────────────────────────────────────────────────
function DayPanel({ date, users, onClose }) {
  return (
    <AnimatePresence>
      {date && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-white font-semibold text-sm">{date}</h3>
              <p className="text-white/35 text-xs mt-0.5">
                {users.length} signup{users.length !== 1 ? 's' : ''} on this day
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl glass border border-white/[0.08] text-white/50 hover:text-white text-xs transition-all"
            >
              <RiCloseLine size={14} /> Close
            </button>
          </div>
          {users.length > 0
            ? <UserTable users={users} title={`Signups — ${date}`} />
            : (
              <div className="glass rounded-2xl border p-8 text-center text-white/30 text-sm">
                No signups recorded for {date}
              </div>
            )
          }
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Period breakdown table ─────────────────────────────────────────────────
function PeriodTable({ data = [], periodLabel = 'Date', onSelectDay, selectedDay, enableDrilldown }) {
  const total = data.reduce((s, d) => s + d.users, 0)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass rounded-2xl border overflow-hidden"
    >
      <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm">Period Breakdown</h3>
          {enableDrilldown && (
            <p className="text-white/35 text-xs mt-0.5">Click a row to see that period's signups</p>
          )}
        </div>
        <span className="text-white/30 text-xs tabular-nums">
          {total.toLocaleString()} total
        </span>
      </div>
      <div className="overflow-x-auto max-h-80 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10" style={{ background: 'rgba(13,13,26,0.95)' }}>
            <tr className="border-b border-white/[0.04]">
              <th className="text-left   px-5 py-2.5 text-white/30 text-[11px] font-semibold uppercase tracking-wider w-8">#</th>
              <th className="text-left   px-5 py-2.5 text-white/30 text-[11px] font-semibold uppercase tracking-wider">{periodLabel}</th>
              <th className="text-right  px-5 py-2.5 text-white/30 text-[11px] font-semibold uppercase tracking-wider">Signups</th>
              <th className="text-right  px-5 py-2.5 text-white/30 text-[11px] font-semibold uppercase tracking-wider">Share</th>
              <th className="text-right  px-5 py-2.5 text-white/30 text-[11px] font-semibold uppercase tracking-wider">vs Prev</th>
            </tr>
          </thead>
          <tbody>
            {data.map((day, i) => {
              const prev   = data[i + 1]?.users ?? null
              const change = prev !== null && prev > 0
                ? ((day.users - prev) / prev * 100).toFixed(1)
                : null
              const sharePct   = total > 0 ? (day.users / total * 100).toFixed(1) : '0.0'
              const isSelected = enableDrilldown && selectedDay === day.date
              return (
                <tr
                  key={day.date + i}
                  onClick={() => enableDrilldown && onSelectDay(isSelected ? null : day.date)}
                  className={`border-b border-white/[0.03] transition-colors ${enableDrilldown ? 'cursor-pointer' : ''} ${isSelected ? 'bg-indigo-500/10' : enableDrilldown ? 'hover:bg-white/[0.025]' : ''}`}
                >
                  <td className="px-5 py-2.5 text-white/20 text-xs tabular-nums">
                    {data.length - i}
                  </td>
                  <td className="px-5 py-2.5">
                    <span className={`text-xs font-medium ${isSelected ? 'text-indigo-300' : 'text-white/60'}`}>
                      {day.date}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <span className="text-white/80 text-xs font-semibold tabular-nums">
                      {day.users.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <span className="text-white/35 text-xs tabular-nums">{sharePct}%</span>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    {change !== null ? (
                      <span className={`text-xs font-semibold ${parseFloat(change) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {parseFloat(change) >= 0 ? '+' : ''}{change}%
                      </span>
                    ) : (
                      <span className="text-white/20 text-xs">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

// ─── Main page ──────────────────────────────────────────────────────────────
export default function Analytics() {
  const { data, stats, loading }          = useWaitlist()
  const [range, setRange]                 = useState('30d')
  const [selectedDay, setSelectedDay]     = useState(null)

  const rc = useMemo(() => getRangeData(range, stats), [range, stats])

  const dayUsers = useMemo(() => {
    if (!selectedDay || !rc.enableDrilldown) return []
    return data.filter(u => {
      const key = new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      return key === selectedDay
    })
  }, [data, selectedDay, rc.enableDrilldown])

  function handleRangeChange(r) {
    setRange(r)
    setSelectedDay(null)
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <ChartSkeleton height="h-80" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartSkeleton /><ChartSkeleton /><ChartSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-white/35 text-xs mt-1">Detailed growth & distribution insights</p>
        </div>
      </div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total Signups"   value={stats.totalUsers} icon={RiGroupLine}        variant="indigo"  delay={0}    />
        <StatCard title="This Month"      value={stats.monthUsers} icon={RiCalendarLine}      variant="cyan"    delay={0.05} />
        <StatCard title="This Week"       value={stats.weekUsers}  icon={RiCalendarCheckLine} variant="purple"  delay={0.1}  trend={stats.growthRate} />
      </div>

      {/* ── Time range filter — above the chart ── */}
      <div className="flex items-center gap-1 p-1 glass rounded-xl border w-fit">
        {RANGES.map(r => (
          <button
            key={r.key}
            onClick={() => handleRangeChange(r.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              range === r.key
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'text-white/45 hover:text-white'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* ── Range summary stat ── */}
      {rc.total > 0 && (
        <motion.div
          key={range}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-white/30 text-xs">{rc.subtitle} ·</span>
          <span className="text-white font-bold text-sm tabular-nums">{rc.total.toLocaleString()}</span>
          <span className="text-white/30 text-xs">signups in this period</span>
        </motion.div>
      )}

      {/* ── Main chart ── */}
      <DailySignupsChart
        data={rc.chartData}
        title={rc.chartTitle}
        subtitle={rc.subtitle}
        xKey={rc.xKey}
        onBarClick={rc.enableDrilldown
          ? d => setSelectedDay(prev => prev === d ? null : d)
          : undefined
        }
      />

      {/* ── Day drill-down panel ── */}
      <DayPanel date={selectedDay} users={dayUsers} onClose={() => setSelectedDay(null)} />

      {/* ── Period breakdown table ── */}
      <PeriodTable
        data={rc.tableData}
        periodLabel={rc.periodLabel}
        onSelectDay={setSelectedDay}
        selectedDay={selectedDay}
        enableDrilldown={rc.enableDrilldown}
      />

      {/* ── Distribution row ── */}
      {(stats.countryData.length > 0 || stats.deviceData.length > 0 || stats.sourceData.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {stats.countryData.length > 0 && (
            <CountryBarChart data={stats.countryData} allData={stats.allCountryData} />
          )}
          {stats.deviceData.length  > 0 && <DevicePieChart data={stats.deviceData} />}
          {stats.sourceData.length  > 0 && <SourceList     data={stats.sourceData} />}
        </div>
      )}

      {/* ── Referral section ── */}
      {stats.hasReferralData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Referred"
            value={stats.totalReferred}
            icon={RiShareLine}
            variant="emerald"
            delay={0}
          />
          <StatCard
            title="Referral Rate"
            value={stats.referralRate}
            icon={RiUserStarLine}
            variant="amber"
            delay={0.05}
            suffix="%"
          />
          <ReferralLeaderboard
            referrers={stats.topReferrers}
            totalReferred={stats.totalReferred}
            referralRate={stats.referralRate}
          />
        </div>
      )}
    </div>
  )
}
