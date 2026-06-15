function downloadCSV(rows, filename) {
  const csv = rows
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

// Generic exporter for arbitrary tabular data (e.g. period breakdowns)
export function exportRowsToCSV(headers, rows, filename = 'export.csv') {
  downloadCSV([headers, ...rows], filename)
}

// Country breakdown exporter — rank, country, users, share %
export function exportCountriesToCSV(countryData, filename = 'countries.csv') {
  const total = countryData.reduce((s, d) => s + d.count, 0)
  const rows  = countryData.map((d, i) => [
    i + 1,
    d.country,
    d.count,
    total > 0 ? (d.count / total * 100).toFixed(1) : '0.0',
  ])
  downloadCSV([['Rank', 'Country', 'Users', 'Share %'], ...rows], filename)
}

export function exportToCSV(data, filename = 'waitlist-export.csv') {
  const hasCountry      = data.some(u => u.country)
  const hasDevice       = data.some(u => u.device)
  const hasSource       = data.some(u => u.source)
  const hasReferralCode = data.some(u => u.referralCode)

  const headers = [
    '#', 'Email',
    ...(hasCountry ? ['Country'] : []),
    ...(hasDevice  ? ['Device']  : []),
    ...(hasSource  ? ['Source']  : []),
    ...(hasReferralCode ? ['Referral Code'] : []),
    'Status', 'Joined At',
  ]

  const rows = data.map((u, i) => [
    i + 1,
    u.email || '',
    ...(hasCountry ? [u.country || ''] : []),
    ...(hasDevice  ? [u.device  || ''] : []),
    ...(hasSource  ? [u.source  || ''] : []),
    ...(hasReferralCode ? [u.referralCode || ''] : []),
    u.status === '1' ? 'Active' : 'Inactive',
    new Date(u.createdAt).toLocaleString(),
  ])

  downloadCSV([headers, ...rows], filename)
}
