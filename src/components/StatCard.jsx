import { motion } from 'framer-motion'
import AnimatedCounter from './AnimatedCounter'

const VARIANTS = {
  indigo:  { glow: '#6366f1', from: 'from-indigo-500',  to: 'to-violet-600',  text: 'text-indigo-400',  ring: 'border-indigo-500/20 bg-indigo-500/10'  },
  cyan:    { glow: '#06b6d4', from: 'from-cyan-500',    to: 'to-blue-500',    text: 'text-cyan-400',    ring: 'border-cyan-500/20 bg-cyan-500/10'    },
  purple:  { glow: '#a855f7', from: 'from-violet-500',  to: 'to-fuchsia-600', text: 'text-violet-400',  ring: 'border-violet-500/20 bg-violet-500/10' },
  emerald: { glow: '#10b981', from: 'from-emerald-500', to: 'to-teal-500',    text: 'text-emerald-400', ring: 'border-emerald-500/20 bg-emerald-500/10'},
  amber:   { glow: '#f59e0b', from: 'from-amber-500',   to: 'to-orange-500',  text: 'text-amber-400',   ring: 'border-amber-500/20 bg-amber-500/10'   },
}

export default function StatCard({
  title, value, icon: Icon, variant = 'indigo',
  suffix = '', prefix = '', decimals = 0,
  trend, trendLabel = 'vs last week',
  delay = 0,
}) {
  const v = VARIANTS[variant] || VARIANTS.indigo

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden rounded-2xl p-5 glass border hover:border-white/[0.12] transition-all duration-300 group cursor-default"
    >
      {/* Background glow orb */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-[0.12] blur-2xl pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.20]"
        style={{ background: v.glow }}
      />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-sm font-medium">{title}</span>
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${v.ring}`}>
            <Icon size={17} className={v.text} />
          </div>
        </div>

        <div className="flex items-end gap-1">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {prefix}<AnimatedCounter value={value} decimals={decimals} />{suffix}
          </span>
        </div>

        {trend !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${trend >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
            <span className="text-white/30 text-xs">{trendLabel}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
