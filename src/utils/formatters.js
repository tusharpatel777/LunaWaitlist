export function formatNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

export function formatPercent(n, showSign = true) {
  const sign = showSign && n > 0 ? '+' : ''
  return `${sign}${n.toFixed(1)}%`
}

export function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function timeAgo(d) {
  if (!d) return '—'
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60_000)
  const h = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (m  <  1) return 'just now'
  if (m  < 60) return `${m}m ago`
  if (h  < 24) return `${h}h ago`
  return `${days}d ago`
}

export function shortDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
