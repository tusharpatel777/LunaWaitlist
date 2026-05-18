import { motion, AnimatePresence } from 'framer-motion'
import {
  RiGroupLine, RiCalendarCheckLine,
  RiCalendarLine, RiAlertLine,
  RiRefreshLine, RiDownloadLine,
} from 'react-icons/ri'
import { useWaitlist } from '../context/WaitlistContext'
import StatCard from '../components/StatCard'
import ExportButton from '../components/ExportButton'
import LiveIndicator from '../components/LiveIndicator'
import { StatCardSkeleton, ChartSkeleton } from '../components/SkeletonLoader'
import RealTimeLineChart from '../charts/RealTimeLineChart'
import CountryBarChart from '../charts/CountryBarChart'
import DevicePieChart from '../charts/DevicePieChart'
import { formatDate } from '../utils/formatters'

export default function Dashboard() {
  const { data, loading, error, stats, hasFetched, lastUpdated, refresh, isMock } = useWaitlist()

  // ── Before first fetch ──────────────────────────────────────────────────────
  if (!hasFetched) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        {/* Glowing orb */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 opacity-20 blur-2xl absolute inset-0 scale-150" />
          <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 border border-indigo-500/30 flex items-center justify-center">
            <RiGroupLine size={44} className="text-indigo-400" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Waitlist Analytics</h2>
          <p className="text-white/40 text-sm max-w-xs">
            Click the button below to load your waitlist data and view live analytics.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-base shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow disabled:opacity-60"
        >
          {loading ? (
            <RiRefreshLine size={20} className="animate-spin" />
          ) : (
            <RiDownloadLine size={20} />
          )}
          {loading ? 'Loading data…' : 'Load Waitlist Data'}
        </motion.button>

        {isMock && (
          <p className="text-white/25 text-xs">Demo mode — no API URL configured</p>
        )}
      </div>
    )
  }

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading && !hasFetched) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSkeleton /><ChartSkeleton />
        </div>
        <ChartSkeleton />
      </div>
    )
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <LiveIndicator />
            <span className="text-white/35 text-xs">
              {lastUpdated ? `Fetched at ${formatDate(lastUpdated)}` : ''}
              {isMock ? ' · Demo mode' : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Export — emails baked into the already-fetched data */}
          <ExportButton data={data} filename="waitlist-full.csv" />

          {/* Manual refresh */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/[0.10] text-white/60 hover:text-white hover:border-white/20 text-sm font-medium transition-all disabled:opacity-40"
          >
            <RiRefreshLine size={15} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing…' : 'Refresh'}
          </motion.button>
        </div>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            <RiAlertLine size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Signups"
          value={stats.totalUsers}
          icon={RiGroupLine}
          variant="indigo"
          delay={0}
        />
        <StatCard
          title="Today"
          value={stats.todayUsers}
          icon={RiCalendarCheckLine}
          variant="cyan"
          delay={0.05}
        />
        <StatCard
          title="This Week"
          value={stats.weekUsers}
          icon={RiCalendarLine}
          variant="purple"
          delay={0.1}
        />
      </div>

      {/* Charts row */}
      <div className={`grid grid-cols-1 gap-4 ${stats.deviceData.length ? 'lg:grid-cols-5' : ''}`}>
        <div className={stats.deviceData.length ? 'lg:col-span-3' : ''}>
          <RealTimeLineChart data={stats.hourlyData} />
        </div>
        {stats.deviceData.length > 0 && (
          <div className="lg:col-span-2">
            <DevicePieChart data={stats.deviceData} />
          </div>
        )}
      </div>

      {/* Country chart — only when data exists */}
      {stats.countryData.length > 0 && <CountryBarChart data={stats.countryData} />}
    </div>
  )
}
