import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri'
import { timeAgo } from '../utils/formatters'

const DEVICE_BADGE = {
  Mobile:  'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  Desktop: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  Tablet:  'text-violet-400 bg-violet-400/10 border-violet-400/20',
}

function Avatar({ email }) {
  const char = (email?.[0] ?? '?').toUpperCase()
  const hue  = (email?.charCodeAt(0) ?? 0) * 13 % 360
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ background: `hsl(${hue},55%,38%)` }}
    >
      {char}
    </div>
  )
}

function SortTh({ children, field, sortField, sortDir, onSort, className = '' }) {
  if (!onSort) {
    return (
      <th className={`text-left px-5 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider ${className}`}>
        {children}
      </th>
    )
  }
  const active = sortField === field
  return (
    <th
      onClick={() => onSort(field)}
      className={`text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none group ${className}`}
    >
      <span className={`inline-flex items-center gap-1 transition-colors ${active ? 'text-indigo-400' : 'text-white/30 group-hover:text-white/55'}`}>
        {children}
        {active
          ? (sortDir === 'asc'
              ? <RiArrowUpLine size={11} />
              : <RiArrowDownLine size={11} />)
          : <span className="text-white/15 text-[10px]">⇅</span>
        }
      </span>
    </th>
  )
}

export default function UserTable({
  users,
  title = 'Recent Signups',
  subtitle,
  sortField,
  sortDir,
  onSort,
}) {
  const show = useMemo(() => ({
    country:      users.some(u => u.country),
    device:       users.some(u => u.device),
    source:       users.some(u => u.source),
    referralCode: users.some(u => u.referralCode),
    referredBy:   users.some(u => u.referredBy),
  }), [users])

  if (!users.length) {
    return (
      <div className="rounded-2xl glass border p-10 text-center text-white/30 text-sm">
        No users found
      </div>
    )
  }

  return (
    <div className="rounded-2xl glass border overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          {subtitle && <p className="text-white/35 text-xs mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-white/30 text-xs">{users.length} entries</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.04]">
              <SortTh field="email"     sortField={sortField} sortDir={sortDir} onSort={onSort}>Email</SortTh>
              {show.country      && <SortTh field="country"     sortField={sortField} sortDir={sortDir} onSort={onSort}>Country</SortTh>}
              {show.device       && <SortTh field="device"      sortField={sortField} sortDir={sortDir} onSort={onSort}>Device</SortTh>}
              {show.source       && <SortTh field="source"      sortField={sortField} sortDir={sortDir} onSort={onSort}>Source</SortTh>}
              {show.referralCode && <th className="text-left px-5 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider">Ref Code</th>}
              {show.referredBy   && <th className="text-left px-5 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider">Referred By</th>}
              <SortTh field="createdAt" sortField={sortField} sortDir={sortDir} onSort={onSort}>Joined</SortTh>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <motion.tr
                key={u.id || u.email + i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.018, 0.3) }}
                className="border-b border-white/[0.03] hover:bg-white/[0.025] transition-colors group"
              >
                {/* Email */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar email={u.email} />
                    <span className="text-white/75 truncate max-w-[200px]">{u.email || '—'}</span>
                  </div>
                </td>

                {/* Country */}
                {show.country && (
                  <td className="px-5 py-3 text-white/50 whitespace-nowrap">
                    {u.country || '—'}
                  </td>
                )}

                {/* Device */}
                {show.device && (
                  <td className="px-5 py-3">
                    {u.device ? (
                      <span className={`text-xs px-2 py-0.5 rounded-lg border font-medium ${DEVICE_BADGE[u.device] || 'text-white/40 bg-white/5 border-white/10'}`}>
                        {u.device}
                      </span>
                    ) : <span className="text-white/25">—</span>}
                  </td>
                )}

                {/* Source */}
                {show.source && (
                  <td className="px-5 py-3 text-white/45 whitespace-nowrap">{u.source || '—'}</td>
                )}

                {/* Referral Code */}
                {show.referralCode && (
                  <td className="px-5 py-3">
                    {u.referralCode ? (
                      <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                        {u.referralCode}
                      </span>
                    ) : <span className="text-white/25">—</span>}
                  </td>
                )}

                {/* Referred By */}
                {show.referredBy && (
                  <td className="px-5 py-3">
                    {u.referredBy ? (
                      <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                        {u.referredBy}
                      </span>
                    ) : <span className="text-white/25">—</span>}
                  </td>
                )}

                {/* Joined */}
                <td className="px-5 py-3 text-white/35 whitespace-nowrap text-xs">
                  {timeAgo(u.createdAt)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
