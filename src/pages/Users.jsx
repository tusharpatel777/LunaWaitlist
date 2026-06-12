import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { RiGroupLine } from 'react-icons/ri'
import { useWaitlist } from '../context/WaitlistContext'
import UserTable from '../components/UserTable'
import SearchFilter from '../components/SearchFilter'
import ExportButton from '../components/ExportButton'
import DateRangeFilter from '../components/DateRangeFilter'
import { TableSkeleton } from '../components/SkeletonLoader'

const PAGE_SIZE = 25

export default function Users() {
  const { data, loading, stats } = useWaitlist()

  const [search,    setSearch]    = useState('')
  const [device,    setDevice]    = useState('')
  const [country,   setCountry]   = useState('')
  const [source,    setSource]    = useState('')
  const [dateRange, setDateRange] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortDir,   setSortDir]   = useState('desc')
  const [page,      setPage]      = useState(1)

  const countries    = useMemo(() => [...new Set(data.map(u => u.country).filter(Boolean))].sort(), [data])
  const hasDeviceData = useMemo(() => data.some(u => u.device),  [data])

  const now        = Date.now()
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).getTime()

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data
      .filter(u => {
        const t = new Date(u.createdAt).getTime()
        const matchSearch  = !q || u.email?.toLowerCase().includes(q) || u.country?.toLowerCase().includes(q) || u.source?.toLowerCase().includes(q) || u.referralCode?.toLowerCase().includes(q) || u.referredBy?.toLowerCase().includes(q)
        const matchDevice  = !device    || u.device  === device
        const matchCountry = !country   || u.country === country
        const matchSource  = !source    || u.source  === source
        const matchDate    = !dateRange
          || (dateRange === 'today' && t >= todayStart)
          || (dateRange === 'week'  && now - t <= 7  * 86_400_000)
          || (dateRange === 'month' && now - t <= 30 * 86_400_000)
        return matchSearch && matchDevice && matchCountry && matchSource && matchDate
      })
      .sort((a, b) => {
        const mul = sortDir === 'asc' ? 1 : -1
        if (sortField === 'email')     return mul * (a.email || '').localeCompare(b.email || '')
        if (sortField === 'country')   return mul * (a.country || '').localeCompare(b.country || '')
        if (sortField === 'device')    return mul * (a.device || '').localeCompare(b.device || '')
        if (sortField === 'source')    return mul * (a.source || '').localeCompare(b.source || '')
        if (sortField === 'createdAt') return mul * (new Date(a.createdAt) - new Date(b.createdAt))
        return 0
      })
  }, [data, search, device, country, source, dateRange, sortField, sortDir, now, todayStart])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSort(field) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
    setPage(1)
  }

  function resetFilters() {
    setSearch(''); setDevice(''); setCountry(''); setSource(''); setDateRange('')
  }

  function handleSearchChange(v) { setSearch(v);    setPage(1) }
  function handleDevice(v)       { setDevice(v);    setPage(1) }
  function handleCountry(v)      { setCountry(v);   setPage(1) }
  function handleSource(v)       { setSource(v);    setPage(1) }
  function handleDateRange(v)    { setDateRange(v); setPage(1) }

  if (loading) return <TableSkeleton />

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Users</h1>
          <p className="text-white/35 text-xs mt-1">
            {filtered.length.toLocaleString()} / {data.length.toLocaleString()} total
          </p>
        </div>
        <ExportButton data={filtered} filename="waitlist-filtered.csv" />
      </div>

      {/* Global date filter */}
      <DateRangeFilter />

      {/* Filters */}
      <SearchFilter
        search={search}       onSearch={handleSearchChange}
        device={device}       onDevice={handleDevice}
        country={country}     onCountry={handleCountry}
        source={source}       onSource={handleSource}
        dateRange={dateRange} onDateRange={handleDateRange}
        countries={countries}
        sources={stats.sources}
        hasDeviceData={hasDeviceData}
      />

      {/* Table */}
      <UserTable
        users={paged}
        title="All Users"
        subtitle={`Page ${page} of ${totalPages || 1}`}
        sortField={sortField}
        sortDir={sortDir}
        onSort={handleSort}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2"
        >
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-xl glass border border-white/[0.08] text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-all"
          >
            ← Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              let p = i + 1
              if (totalPages > 7) {
                if (page <= 4)                   p = i + 1
                else if (page >= totalPages - 3) p = totalPages - 6 + i
                else                             p = page - 3 + i
              }
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    page === p
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                      : 'glass border border-white/[0.08] text-white/40 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              )
            })}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-xl glass border border-white/[0.08] text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-all"
          >
            Next →
          </button>
        </motion.div>
      )}

      {/* Empty state */}
      {!filtered.length && (
        <div className="text-center py-16 text-white/25">
          <RiGroupLine size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No users match your filters</p>
          <button
            onClick={resetFilters}
            className="mt-3 text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
