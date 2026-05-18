import { useMemo } from 'react'
import { motion } from 'framer-motion'
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

export default function UserTable({ users, title = 'Recent Signups', subtitle }) {
  // Only show a column if at least one row has a real value for it
  const show = useMemo(() => ({
    country: users.some(u => u.country),
    device:  users.some(u => u.device),
    source:  users.some(u => u.source),
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
              <th className="text-left px-5 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider">Email</th>
              {show.country && <th className="text-left px-5 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider">Country</th>}
              {show.device  && <th className="text-left px-5 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider">Device</th>}
              {show.source  && <th className="text-left px-5 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider">Source</th>}
              <th className="text-left px-5 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <motion.tr
                key={u.id || u.email + i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.018, 0.3) }}
                className="border-b border-white/[0.03] hover:bg-white/[0.025] transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar email={u.email} />
                    <span className="text-white/75 truncate max-w-[220px]">{u.email || '—'}</span>
                  </div>
                </td>
                {show.country && <td className="px-5 py-3 text-white/50 whitespace-nowrap">{u.country || '—'}</td>}
                {show.device  && (
                  <td className="px-5 py-3">
                    {u.device ? (
                      <span className={`text-xs px-2 py-0.5 rounded-lg border font-medium ${DEVICE_BADGE[u.device] || 'text-white/40 bg-white/5 border-white/10'}`}>
                        {u.device}
                      </span>
                    ) : <span className="text-white/25">—</span>}
                  </td>
                )}
                {show.source  && <td className="px-5 py-3 text-white/45 whitespace-nowrap">{u.source || '—'}</td>}
                <td className="px-5 py-3 text-white/35 whitespace-nowrap text-xs">{timeAgo(u.createdAt)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
