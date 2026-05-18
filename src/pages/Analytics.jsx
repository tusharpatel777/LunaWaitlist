import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  RiBarChartLine, RiGroupLine, RiCalendarLine,
  RiLineChartLine,
} from 'react-icons/ri'
import { useWaitlist } from '../context/WaitlistContext'
import StatCard from '../components/StatCard'
import CountryBarChart from '../charts/CountryBarChart'
import DevicePieChart from '../charts/DevicePieChart'
import DailySignupsChart from '../charts/DailySignupsChart'
import { StatCardSkeleton, ChartSkeleton } from '../components/SkeletonLoader'
import { formatNumber } from '../utils/formatters'

// Source distribution mini-chart
function SourceList({ data = [] }) {
  if (!data.length) return (
    <div className="glass rounded-2xl border p-5">
      <h3 className="text-white font-semibold text-sm mb-4">Traffic Sources</h3>
      <p className="text-white/25 text-sm">No source data available</p>
    </div>
  )

  const total = data.reduce((s, d) => s + d.value, 0)
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
                <span className="text-white/50 text-xs">{formatNumber(item.value)} ({pct}%)</span>
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

export default function Analytics() {
  const { stats, loading } = useWaitlist()
  const [range, setRange] = useState('30d')

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-white/35 text-xs mt-1">Detailed growth & distribution insights</p>
        </div>
        <div className="flex items-center gap-1.5 p-1 glass rounded-xl border">
          {['7d', '30d'].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                range === r
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                  : 'text-white/45 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Signups"  value={stats.totalUsers} icon={RiGroupLine}      variant="indigo"  delay={0}    />
        <StatCard title="This Month"     value={stats.monthUsers} icon={RiCalendarLine}   variant="cyan"    delay={0.05} />
        <StatCard title="This Week"      value={stats.weekUsers}  icon={RiBarChartLine}   variant="purple"  delay={0.1}  />
        <StatCard
          title="Growth"
          value={stats.growthRate}
          icon={RiLineChartLine}
          variant="emerald"
          suffix="%"
          decimals={1}
          trend={stats.growthRate}
          trendLabel="week-over-week"
          delay={0.15}
        />
      </div>

      {/* Daily chart */}
      <DailySignupsChart data={stats.dailyData} />

      {/* Bottom row — only render cards that have data */}
      {(stats.countryData.length > 0 || stats.deviceData.length > 0 || stats.sourceData.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {stats.countryData.length > 0 && <CountryBarChart data={stats.countryData} />}
          {stats.deviceData.length  > 0 && <DevicePieChart  data={stats.deviceData}  />}
          {stats.sourceData.length  > 0 && <SourceList      data={stats.sourceData}  />}
        </div>
      )}
    </div>
  )
}
