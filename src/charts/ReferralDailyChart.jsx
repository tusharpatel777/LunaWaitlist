import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { RiShareLine } from 'react-icons/ri'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-strong rounded-xl px-3 py-2 border border-white/10 shadow-xl">
      <p className="text-white/45 text-xs mb-0.5">{label}</p>
      <p className="text-emerald-400 font-bold text-sm">
        {payload[0].value.toLocaleString()} referral{payload[0].value !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

export default function ReferralDailyChart({ data = [] }) {
  const count = data.length
  const total = data.reduce((s, d) => s + d.referrals, 0)
  const peak  = data.reduce((m, d) => Math.max(m, d.referrals), 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl border p-5"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
            <RiShareLine size={14} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Referrals Over Time</h3>
            <p className="text-white/35 text-xs mt-0.5">Referred signups — day by day</p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-right">
          <div>
            <p className="text-white/25 text-[10px] uppercase tracking-wide">Total</p>
            <p className="text-white/70 text-xs font-semibold tabular-nums">{total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-white/25 text-[10px] uppercase tracking-wide">Peak day</p>
            <p className="text-white/70 text-xs font-semibold tabular-nums">{peak.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="h-56">
        {!total ? (
          <div className="h-full flex items-center justify-center text-white/20 text-sm">
            No referrals in this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="referralGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="transparent"
                tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9 }}
                tickLine={false}
                interval={count <= 7 ? 0 : count <= 14 ? 1 : count <= 30 ? 4 : Math.ceil(count / 12)}
              />
              <YAxis
                stroke="transparent"
                tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(16,185,129,0.3)', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="referrals"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#referralGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#34d399', strokeWidth: 0 }}
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
}
