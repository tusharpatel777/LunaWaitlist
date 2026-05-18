import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ec4899','#14b8a6','#a78bfa']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-strong rounded-xl px-3 py-2 border border-white/10 shadow-xl">
      <p className="text-white/45 text-xs mb-0.5">{label}</p>
      <p className="text-white font-bold text-sm">{payload[0].value.toLocaleString()} users</p>
    </div>
  )
}

export default function CountryBarChart({ data = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl border p-5"
    >
      <div className="mb-4">
        <h3 className="text-white font-semibold text-sm">Top Countries</h3>
        <p className="text-white/35 text-xs mt-0.5">User distribution by country</p>
      </div>

      <div className="h-52">
        {!data.length ? (
          <div className="h-full flex items-center justify-center text-white/20 text-sm">
            No country data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="country"
                stroke="transparent"
                tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 10 }}
                tickLine={false}
                tickFormatter={v => v.length > 8 ? v.slice(0, 8) + '…' : v}
              />
              <YAxis
                stroke="transparent"
                tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" radius={[5, 5, 0, 0]} maxBarSize={40} animationDuration={600}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
}
