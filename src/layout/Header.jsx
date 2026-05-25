import { RiMenuLine } from 'react-icons/ri'
import LiveIndicator from '../components/LiveIndicator'
import { useWaitlist } from '../context/WaitlistContext'
import { timeAgo } from '../utils/formatters'

export default function Header({ onMenuClick }) {
  const { lastUpdated, hasFetched } = useWaitlist()

  return (
    <header
      className="h-14 px-5 flex items-center gap-3 flex-shrink-0"
      style={{
        background:           'rgba(4, 4, 14, 0.60)',
        backdropFilter:       'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom:         '1px solid rgba(255,255,255,0.058)',
        boxShadow:            '0 1px 0 rgba(255,255,255,0.025)',
      }}
    >
      <button
        onClick={onMenuClick}
        className="lg:hidden text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.06]"
      >
        <RiMenuLine size={19} />
      </button>

      <div className="flex items-center gap-2">
        <LiveIndicator />
        <span className="text-white/35 text-xs hidden sm:block tracking-tight">
          {hasFetched && lastUpdated
            ? `Updated ${timeAgo(lastUpdated)}`
            : 'No data loaded yet'}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Optional: subtle brand mark in header */}
        <span
          className="hidden sm:block text-[10px] font-bold tracking-[0.18em] uppercase"
          style={{ color: 'rgba(255,255,255,0.12)' }}
        >
          Luna Analytics
        </span>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow:  '0 0 12px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          A
        </div>
      </div>
    </header>
  )
}
