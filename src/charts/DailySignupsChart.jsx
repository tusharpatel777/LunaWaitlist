import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-strong rounded-xl px-3 py-2 border border-white/10 shadow-xl">
      <p className="text-white/45 text-xs mb-0.5">{label}</p>
      <p className="text-violet-400 font-bold text-sm">{payload[0].value} signups</p>
    </div>
  )
}

export default function DailySignupsChart({ data = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl border p-5"
    >
      <div className="mb-4">
        <h3 className="text-white font-semibold text-sm">Daily Signups</h3>
        <p className="text-white/35 text-xs mt-0.5">Last 30 days</p>
      </div>

      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#a855f7" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="transparent"
              tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9 }}
              tickLine={false}
              interval={4}
            />
            <YAxis
              stroke="transparent"
              tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar
              dataKey="users"
              fill="url(#dailyGrad)"
              radius={[4, 4, 0, 0]}
              maxBarSize={18}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
