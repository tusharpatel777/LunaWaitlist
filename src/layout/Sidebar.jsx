import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiDashboardLine, RiBarChartBoxLine, RiUserSearchLine,
  RiCloseLine, RiLogoutBoxLine,
} from 'react-icons/ri'
import LiveIndicator from '../components/LiveIndicator'

const NAV = [
  { to: '/',          label: 'Dashboard', icon: RiDashboardLine    },
  { to: '/analytics', label: 'Analytics', icon: RiBarChartBoxLine  },
  { to: '/users',     label: 'Users',     icon: RiUserSearchLine   },
]

export default function Sidebar({ open, onClose, onLogout }) {
  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-20 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={[
          'fixed lg:static inset-y-0 left-0 z-30 w-60 flex flex-col',
          'bg-[#0b0b18]/95 border-r border-white/[0.05]',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.05]">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <img
              src="//www.lunazone.com/cdn/shop/files/Group_1321314750.svg?v=1713867828"
              alt="Luna"
              className="h-4 w-auto object-contain flex-shrink-0"
            />
            <span className="text-white/50 text-sm font-medium tracking-wide">Analytics</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/30 hover:text-white transition-colors p-1">
            <RiCloseLine size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-white/20 text-[10px] font-semibold uppercase tracking-widest px-3 pb-2">Menu</p>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                    : 'text-white/45 hover:text-white hover:bg-white/[0.05] border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} className={isActive ? 'text-indigo-400' : 'text-white/40'} />
                  {label}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/[0.05] space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <LiveIndicator />
            <span className="text-white/35 text-xs">Manual refresh mode</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/15 transition-all duration-150"
          >
            <RiLogoutBoxLine size={17} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
