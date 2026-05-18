import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'

const COLORS  = { Mobile: '#06b6d4', Desktop: '#6366f1', Tablet: '#a855f7' }
const DEFAULT = ['#6366f1','#06b6d4','#a855f7','#10b981']

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-strong rounded-xl px-3 py-2 border border-white/10 shadow-xl">
      <p className="text-white/45 text-xs mb-0.5">{payload[0].name}</p>
      <p className="text-white font-bold text-sm">{payload[0].value.toLocaleString()} users</p>
      <p className="text-white/40 text-xs">{payload[0].payload.percent}%</p>
    </div>
  )
}

function CustomLegend({ payload = [] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2">
      {payload.map(p => (
        <li key={p.value} className="flex items-center gap-1.5 text-white/50 text-xs">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: p.color }} />
          {p.value}
        </li>
      ))}
    </ul>
  )
}

export default function DevicePieChart({ data = [] }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const enriched = data.map(d => ({ ...d, percent: total ? Math.round(d.value / total * 100) : 0 }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass rounded-2xl border p-5"
    >
      <div className="mb-4">
        <h3 className="text-white font-semibold text-sm">Device Distribution</h3>
        <p className="text-white/35 text-xs mt-0.5">Signups by device type</p>
      </div>

      <div className="h-52">
        {!data.length ? (
          <div className="h-full flex items-center justify-center text-white/20 text-sm">
            No device data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enriched}
                cx="50%"
                cy="46%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={700}
              >
                {enriched.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name] || DEFAULT[i % DEFAULT.length]}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
}
