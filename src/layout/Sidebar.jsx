import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiDashboardLine, RiBarChartBoxLine, RiUserSearchLine,
  RiCloseLine, RiLogoutBoxLine, RiPulseLine,
} from 'react-icons/ri'

const NAV = [
  { to: '/',          label: 'Dashboard', icon: RiDashboardLine   },
  { to: '/analytics', label: 'Analytics', icon: RiBarChartBoxLine },
  { to: '/users',     label: 'Users',     icon: RiUserSearchLine  },
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
            className="fixed inset-0 z-20 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={[
          'fixed lg:static inset-y-0 left-0 z-30 w-60 flex flex-col',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        style={{
          background:           'rgba(5, 5, 18, 0.72)',
          backdropFilter:       'blur(28px) saturate(160%)',
          WebkitBackdropFilter: 'blur(28px) saturate(160%)',
          borderRight:          '1px solid rgba(255,255,255,0.065)',
          boxShadow:            '1px 0 0 rgba(255,255,255,0.03)',
        }}
      >
        {/* ── Brand ── */}
        <div
          className="flex items-center gap-3 px-5 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.055)' }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Circular logo */}
            <div
              className="flex-shrink-0 flex items-center justify-center"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                padding: '5px',
                background: 'linear-gradient(145deg, #6d28d9 0%, #6366f1 100%)',
                boxShadow: '0 0 10px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <img
                src="//www.lunazone.com/cdn/shop/files/Group_1321314750.svg?v=1713867828"
                alt="Luna"
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold leading-none" style={{ fontSize: '16px', letterSpacing: '-0.01em' }}>
                Analytics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white/30 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.06]"
          >
            <RiCloseLine size={18} />
          </button>
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.15em] px-3 pb-2.5">Menu</p>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive ? 'text-white' : 'text-white/40 hover:text-white/80'
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.14) 100%)',
                border:     '1px solid rgba(99,102,241,0.28)',
                boxShadow:  '0 2px 12px rgba(99,102,241,0.12), 0 1px 0 rgba(255,255,255,0.06) inset',
              } : {
                background: 'transparent',
                border:     '1px solid transparent',
              }}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={16}
                    style={{ color: isActive ? 'rgba(165,180,252,1)' : 'rgba(255,255,255,0.32)', flexShrink: 0 }}
                  />
                  <span style={{ letterSpacing: '-0.01em' }}>{label}</span>
                  {isActive && (
                    <div
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ background: 'linear-gradient(135deg, #a5b4fc, #c084fc)', boxShadow: '0 0 6px rgba(165,180,252,0.6)' }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Footer ── */}
        <div
          className="px-3 py-4 space-y-1"
          style={{ borderTop: '1px solid rgba(255,255,255,0.055)' }}
        >
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="relative flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute inset-0 animate-ping opacity-60" />
            </div>
            <span className="text-white/30 text-xs">Manual refresh mode</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={{
              color: 'rgba(255,255,255,0.35)',
              background: 'transparent',
              border: '1px solid transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color      = 'rgba(248,113,113,0.9)'
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
              e.currentTarget.style.border     = '1px solid rgba(239,68,68,0.18)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color      = 'rgba(255,255,255,0.35)'
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.border     = '1px solid transparent'
            }}
          >
            <RiLogoutBoxLine size={16} style={{ flexShrink: 0 }} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
