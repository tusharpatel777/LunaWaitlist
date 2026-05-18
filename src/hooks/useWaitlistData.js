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
  const now       = Date.now()
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
  const weekMs    = 7  * 86_400_000
  const twoWkMs   = 14 * 86_400_000
  const monthMs   = 30 * 86_400_000

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

  // Country distribution
  const cMap = {}
  data.forEach(u => { if (u.country) cMap[u.country] = (cMap[u.country] || 0) + 1 })
  const countryData = Object.entries(cMap)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

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

  // Daily data – last 30 days
  const dailyMap = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 86_400_000)
    dailyMap[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0
  }
  data.forEach(u => {
    const age = now - new Date(u.createdAt).getTime()
    if (age <= 30 * 86_400_000) {
      const key = new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (key in dailyMap) dailyMap[key]++
    }
  })
  const dailyData = Object.entries(dailyMap).map(([date, users]) => ({ date, users }))

  return {
    totalUsers: data.length,
    todayUsers,
    weekUsers,
    monthUsers,
    growthRate,
    countryData,
    deviceData,
    sourceData,
    hourlyData,
    dailyData,
    recentUsers: data.slice(0, 12),
    hasEnrichment: data.some(u => u.country || u.device),
  }
}

export function useWaitlistData() {
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [hasFetched, setHasFetched]   = useState(false)

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

  const stats = useMemo(() => computeStats(data), [data])

  return { data, loading, error, stats, lastUpdated, hasFetched, refresh: fetchData, isMock }
}
