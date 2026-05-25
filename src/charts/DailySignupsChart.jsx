import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-strong rounded-xl px-3 py-2.5 border border-white/10 shadow-xl">
      <p className="text-white/45 text-xs mb-0.5">{label}</p>
      <p className="text-violet-400 font-bold text-sm">{payload[0].value.toLocaleString()} signups</p>
    </div>
  )
}

export default function DailySignupsChart({
  data      = [],
  title     = 'Signups Over Time',
  subtitle  = '',
  onBarClick,
  xKey      = 'date',
}) {
  const count      = data.length
  const total      = data.reduce((s, d) => s + d.users, 0)
  const avg        = count ? Math.round(total / count) : 0
  const maxBarSize = count <= 7 ? 32 : count <= 30 ? 18 : count <= 90 ? 10 : 28

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl border p-5"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          {subtitle && <p className="text-white/35 text-xs mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-5 text-right">
          <div>
            <p className="text-white/25 text-[10px] uppercase tracking-wide">Total</p>
            <p className="text-white/70 text-xs font-semibold tabular-nums">{total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-white/25 text-[10px] uppercase tracking-wide">Avg/period</p>
            <p className="text-white/70 text-xs font-semibold tabular-nums">{avg.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {onBarClick && (
        <p className="text-white/20 text-[10px] mb-3 -mt-2">
          Click a bar to drill into that day's signups
        </p>
      )}

      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
            onClick={onBarClick ? ({ activePayload }) => {
              if (activePayload?.[0]) onBarClick(activePayload[0].payload.date)
            } : undefined}
          >
            <defs>
              <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#a855f7" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey={xKey}
              stroke="transparent"
              tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9 }}
              tickLine={false}
              interval={count <= 7 ? 0 : count <= 14 ? 1 : count <= 30 ? 4 : count <= 90 ? 6 : 0}
            />
            <YAxis
              stroke="transparent"
              tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar
              dataKey="users"
              fill="url(#dailyGrad)"
              radius={[4, 4, 0, 0]}
              maxBarSize={maxBarSize}
              animationDuration={600}
              cursor={onBarClick ? 'pointer' : 'default'}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
