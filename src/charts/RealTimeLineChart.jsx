import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import LiveIndicator from '../components/LiveIndicator'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-strong rounded-xl px-3 py-2 border border-white/10 shadow-xl">
      <p className="text-white/45 text-xs mb-0.5">{label}</p>
      <p className="text-indigo-400 font-bold text-sm">{payload[0].value} signups</p>
    </div>
  )
}

export default function RealTimeLineChart({ data = [] }) {
  const hasData = data.some(d => d.users > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl border p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Real-time Activity</h3>
          <p className="text-white/35 text-xs mt-0.5">Signups — last 24 hours</p>
        </div>
        <div className="flex items-center gap-1.5">
          <LiveIndicator />
          <span className="text-emerald-400 text-xs font-medium">Live</span>
        </div>
      </div>

      <div className="h-52">
        {!hasData ? (
          <div className="h-full flex items-center justify-center text-white/20 text-sm">
            Waiting for data…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="liveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="transparent"
                tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                tickLine={false}
                interval={3}
              />
              <YAxis
                stroke="transparent"
                tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(99,102,241,0.3)', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#liveGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#818cf8', strokeWidth: 0 }}
                animationDuration={400}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
}
