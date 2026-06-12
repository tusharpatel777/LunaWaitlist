import { useState, useCallback, useRef, useMemo } from 'react'
import toast from 'react-hot-toast'
import { fetchWaitlistData, transformApiData } from '../services/api'
import { generateMockData } from '../utils/mockData'

const TOAST_STYLE = {
  background: 'rgba(13,13,26,0.97)',
  color: '#fff',
  border: '1px solid rgba(99,102,241,0.3)',
  borderRadius: '12px',
}

function computeStats(data) {
  const now        = Date.now()
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
  const weekMs     = 7  * 86_400_000
  const twoWkMs    = 14 * 86_400_000
  const monthMs    = 30 * 86_400_000

  const todayUsers = data.filter(u => new Date(u.createdAt).getTime() >= todayStart).length
  const weekUsers  = data.filter(u => now - new Date(u.createdAt).getTime() <= weekMs).length
  const prevWeek   = data.filter(u => {
    const age = now - new Date(u.createdAt).getTime()
    return age > weekMs && age <= twoWkMs
  }).length
  const monthUsers = data.filter(u => now - new Date(u.createdAt).getTime() <= monthMs).length

  const growthRate = prevWeek > 0
    ? parseFloat(((weekUsers - prevWeek) / prevWeek * 100).toFixed(1))
    : weekUsers > 0 ? 100 : 0

  // Country distribution — keep all, slice to top 8 for charts
  const cMap = {}
  data.forEach(u => { if (u.country) cMap[u.country] = (cMap[u.country] || 0) + 1 })
  const allCountryData = Object.entries(cMap)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
  const countryData = allCountryData.slice(0, 8)

  // Device distribution
  const dMap = {}
  data.forEach(u => { if (u.device) dMap[u.device] = (dMap[u.device] || 0) + 1 })
  const deviceData = Object.entries(dMap).map(([name, value]) => ({ name, value }))

  // Source distribution
  const sMap = {}
  data.forEach(u => { if (u.source) sMap[u.source] = (sMap[u.source] || 0) + 1 })
  const sourceData = Object.entries(sMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // Unique sources list for filter dropdowns
  const sources = sourceData.map(s => s.name)

  // Hourly data – last 24 h
  const hourlyMap = {}
  for (let i = 23; i >= 0; i--) {
    const h = new Date(now - i * 3_600_000).getHours()
    hourlyMap[`${String(h).padStart(2, '0')}:00`] = 0
  }
  data.forEach(u => {
    const age = now - new Date(u.createdAt).getTime()
    if (age <= 86_400_000) {
      const key = `${String(new Date(u.createdAt).getHours()).padStart(2, '0')}:00`
      if (key in hourlyMap) hourlyMap[key]++
    }
  })
  const hourlyData = Object.entries(hourlyMap).map(([time, users]) => ({ time, users }))

  // All-time daily data (ISO key for reliable sorting, no gap-fill)
  const isoDateMap = {}
  data.forEach(u => {
    const d   = new Date(u.createdAt)
    const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    isoDateMap[iso] = (isoDateMap[iso] || 0) + 1
  })
  const allDailyData = Object.entries(isoDateMap)
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([isoDate, users]) => ({
      isoDate,
      date: new Date(isoDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      users,
    }))

  // Monthly data — for "All Time" chart view
  const isoMonthMap = {}
  data.forEach(u => {
    const d   = new Date(u.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    if (!isoMonthMap[key]) {
      isoMonthMap[key] = {
        date:  d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        users: 0,
      }
    }
    isoMonthMap[key].users++
  })
  const monthlyData = Object.entries(isoMonthMap)
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([, v]) => v)

  // Daily data – last 30 days with gap-fill (zero days preserved for short-range charts)
  const dailyMap = {}
  for (let i = 29; i >= 0; i--) {
    const d   = new Date(now - i * 86_400_000)
    const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    dailyMap[iso] = 0
  }
  data.forEach(u => {
    const d   = new Date(u.createdAt)
    const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    if (iso in dailyMap) dailyMap[iso]++
  })
  const dailyData = Object.entries(dailyMap)
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([isoDate, users]) => ({
      isoDate,
      date: new Date(isoDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      users,
    }))

  // Referral daily data — day-by-day referred signups, gap-filled across the data span
  let referralDailyData = []
  if (data.length) {
    const times = data.map(u => new Date(u.createdAt).getTime())
    const end   = new Date(Math.max(...times)); end.setHours(0, 0, 0, 0)
    let   start = new Date(Math.min(...times)); start.setHours(0, 0, 0, 0)
    // Cap the span so the chart stays readable for very old datasets
    if (end - start > 180 * 86_400_000) start = new Date(end.getTime() - 180 * 86_400_000)
    const refDayMap = {}
    for (let t = start.getTime(); t <= end.getTime(); t += 86_400_000) {
      const d   = new Date(t)
      const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      refDayMap[iso] = 0
    }
    data.forEach(u => {
      if (!u.referredBy) return
      const d   = new Date(u.createdAt)
      const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      if (iso in refDayMap) refDayMap[iso]++
    })
    referralDailyData = Object.entries(refDayMap)
      .sort(([a],[b]) => a.localeCompare(b))
      .map(([isoDate, referrals]) => ({
        isoDate,
        date: new Date(isoDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        referrals,
      }))
  }

  // Referral stats
  const refMap = {}
  data.forEach(u => {
    if (u.referredBy) refMap[u.referredBy] = (refMap[u.referredBy] || 0) + 1
  })
  const totalReferred = data.filter(u => u.referredBy).length
  const referralRate  = data.length > 0 ? Math.round(totalReferred / data.length * 100) : 0
  const topReferrers  = Object.entries(refMap)
    .map(([code, count]) => {
      const user = data.find(u => u.referralCode === code)
      return { code, email: user?.email || '—', count }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
  const hasReferralData = data.some(u => u.referralCode)

  return {
    totalUsers: data.length,
    todayUsers,
    weekUsers,
    monthUsers,
    growthRate,
    countryData,
    allCountryData,
    deviceData,
    sourceData,
    sources,
    hourlyData,
    dailyData,
    allDailyData,
    monthlyData,
    recentUsers: data.slice(0, 12),
    hasEnrichment: data.some(u => u.country || u.device),
    // Referral
    totalReferred,
    referralRate,
    topReferrers,
    hasReferralData,
    referralDailyData,
  }
}

export function useWaitlistData() {
  const [data, setData]               = useState([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [hasFetched, setHasFetched]   = useState(false)
  // Global date filter — applies to every view (preset key + ISO from/to dates)
  const [dateFilter, setDateFilter]   = useState({ preset: 'all', from: '', to: '' })

  const prevCountRef = useRef(0)
  const isMock       = !import.meta.env.VITE_API_URL

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let next

      if (isMock) {
        next = generateMockData(200)
      } else {
        const raw   = await fetchWaitlistData()
        const items = Array.isArray(raw) ? raw : (raw?.data ?? raw?.results ?? [])
        next        = transformApiData(items)
      }

      const prev = prevCountRef.current
      if (hasFetched && next.length > prev) {
        const diff = next.length - prev
        toast.success(`🎉 ${diff} new signup${diff > 1 ? 's' : ''} since last fetch!`, { style: TOAST_STYLE })
      }

      prevCountRef.current = next.length
      setData(next)
      setLastUpdated(new Date())
      setHasFetched(true)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to fetch data'
      setError(msg)
      toast.error(`API error: ${msg}`, { style: TOAST_STYLE })
    } finally {
      setLoading(false)
    }
  }, [isMock, hasFetched])

  const filteredData = useMemo(() => {
    if (!dateFilter.from && !dateFilter.to) return data
    const fromT = dateFilter.from ? new Date(dateFilter.from + 'T00:00:00').getTime()     : -Infinity
    const toT   = dateFilter.to   ? new Date(dateFilter.to   + 'T23:59:59.999').getTime() :  Infinity
    return data.filter(u => {
      const t = new Date(u.createdAt).getTime()
      return t >= fromT && t <= toT
    })
  }, [data, dateFilter])

  const stats = useMemo(() => computeStats(filteredData), [filteredData])

  return {
    data: filteredData,
    totalCount: data.length,
    dateFilter,
    setDateFilter,
    loading, error, stats, lastUpdated, hasFetched, refresh: fetchData, isMock,
  }
}
