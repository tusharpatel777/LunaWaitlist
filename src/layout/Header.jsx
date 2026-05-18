import { RiMenuLine } from 'react-icons/ri'
import LiveIndicator from '../components/LiveIndicator'
import { useWaitlist } from '../context/WaitlistContext'
import { timeAgo } from '../utils/formatters'

export default function Header({ onMenuClick }) {
  const { lastUpdated, hasFetched } = useWaitlist()

  return (
    <header className="h-14 px-5 flex items-center gap-3 border-b border-white/[0.05] bg-[#09091a]/70 backdrop-blur-xl flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-white/50 hover:text-white transition-colors p-1"
      >
        <RiMenuLine size={20} />
      </button>

      <div className="flex items-center gap-2">
        <LiveIndicator />
        <span className="text-white/40 text-xs hidden sm:block">
          {hasFetched && lastUpdated ? `Updated ${timeAgo(lastUpdated)}` : 'No data loaded yet'}
        </span>
      </div>

      <div className="ml-auto">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/30">
          A
        </div>
      </div>
    </header>
  )
}
