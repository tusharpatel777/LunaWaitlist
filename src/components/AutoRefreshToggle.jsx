import { motion } from 'framer-motion'

export default function AutoRefreshToggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 group"
      title={enabled ? 'Disable auto-refresh' : 'Enable auto-refresh'}
    >
      <span className="text-white/40 text-xs group-hover:text-white/60 transition-colors hidden sm:block">
        Auto
      </span>
      <div
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-indigo-500' : 'bg-white/10'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow-md"
        />
      </div>
    </button>
  )
}
