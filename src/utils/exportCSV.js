export function exportToCSV(data, filename = 'waitlist-export.csv') {
  const hasCountry = data.some(u => u.country)
  const hasDevice  = data.some(u => u.device)
  const hasSource  = data.some(u => u.source)

  const headers = [
    '#', 'Email',
    ...(hasCountry ? ['Country'] : []),
    ...(hasDevice  ? ['Device']  : []),
    ...(hasSource  ? ['Source']  : []),
    'Status', 'Joined At',
  ]

  const rows = data.map((u, i) => [
    i + 1,
    u.email || '',
    ...(hasCountry ? [u.country || ''] : []),
    ...(hasDevice  ? [u.device  || ''] : []),
    ...(hasSource  ? [u.source  || ''] : []),
    u.status === '1' ? 'Active' : 'Inactive',
    new Date(u.createdAt).toLocaleString(),
  ])

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n')

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
