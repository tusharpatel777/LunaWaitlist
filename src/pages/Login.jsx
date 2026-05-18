import { useState } from 'react'
import { motion } from 'framer-motion'
import { RiLockPasswordLine, RiUserLine, RiEyeLine, RiEyeOffLine, RiShieldCheckLine } from 'react-icons/ri'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [focused, setFocused]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const ok = onLogin(username, password)
    if (!ok) setError('Invalid username or password')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{ background: '#06060f' }}
    >
      {/* Animated gradient orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)' }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[400px] mx-4"
      >
        {/* Glow behind card */}
        <div className="absolute inset-0 rounded-[28px] blur-2xl opacity-30 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.3))' }}
        />

        <div className="relative rounded-[24px] overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* Top accent line */}
          <div className="h-px w-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.8), rgba(139,92,246,0.8), transparent)' }}
          />

          <div className="px-8 pt-10 pb-8">
            {/* Logo section */}
            <div className="flex flex-col items-center mb-9">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="mb-5"
              >
                <img
                  src="//www.lunazone.com/cdn/shop/files/Group_1321314750.svg?v=1713867828"
                  alt="Luna"
                  className="h-9 w-auto object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </motion.div>

              <div className="flex items-center gap-2 mb-1">
                <div className="h-px w-8 bg-white/10" />
                <span className="text-white/30 text-[10px] font-semibold uppercase tracking-[0.2em]">Analytics Dashboard</span>
                <div className="h-px w-8 bg-white/10" />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">

              {/* Username field */}
              <div className="relative">
                <motion.div
                  animate={{ opacity: focused === 'user' ? 1 : 0 }}
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.5), 0 0 16px rgba(99,102,241,0.1)' }}
                />
                <RiUserLine
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: focused === 'user' ? 'rgba(99,102,241,0.9)' : 'rgba(255,255,255,0.25)' }}
                />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocused('user')}
                  onBlur={() => setFocused('')}
                  placeholder="Username"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none transition-all duration-200"
                  style={{
                    background: focused === 'user' ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${focused === 'user' ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                />
              </div>

              {/* Password field */}
              <div className="relative">
                <motion.div
                  animate={{ opacity: focused === 'pass' ? 1 : 0 }}
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.5), 0 0 16px rgba(99,102,241,0.1)' }}
                />
                <RiLockPasswordLine
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: focused === 'pass' ? 'rgba(99,102,241,0.9)' : 'rgba(255,255,255,0.25)' }}
                />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('pass')}
                  onBlur={() => setFocused('')}
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-3.5 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none transition-all duration-200"
                  style={{
                    background: focused === 'pass' ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${focused === 'pass' ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  {showPass ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
                </button>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 text-xs"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Submit button */}
              <div className="pt-1">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.975 }}
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-4 rounded-2xl font-semibold text-sm overflow-hidden disabled:opacity-50"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    boxShadow: '0 2px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 12px 32px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Orange gradient fill layer */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(251,113,20,0.82) 0%, rgba(239,68,20,0.78) 50%, rgba(220,50,10,0.75) 100%)' }}
                  />

                  {/* Top glass gloss — upper half bright sheen */}
                  <div className="absolute inset-x-0 top-0 h-[48%] pointer-events-none"
                    style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.02) 100%)' }}
                  />

                  {/* Bottom dark depth */}
                  <div className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none"
                    style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.18) 0%, transparent 100%)' }}
                  />

                  {/* Diagonal shimmer sweep */}
                  <motion.div
                    animate={{ x: ['-160%', '260%'] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(108deg, transparent 28%, rgba(255,255,255,0.20) 46%, rgba(255,255,255,0.06) 54%, transparent 72%)',
                      transform: 'skewX(-12deg)',
                    }}
                  />

                  {/* Label */}
                  <span className="relative z-10 flex items-center justify-center gap-2.5 text-white tracking-wide"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Authenticating…
                      </>
                    ) : (
                      <>
                        Sign In
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                          className="opacity-75 text-base leading-none"
                        >
                          →
                        </motion.span>
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </form>

            {/* Secure badge */}
            <div className="flex items-center justify-center gap-1.5 mt-6">
              <RiShieldCheckLine size={12} className="text-white/20" />
              <span className="text-white/20 text-[11px]">Secured · Private access only</span>
            </div>
          </div>
        </div>

        {/* Luna branding below card */}
        <p className="text-center text-white/15 text-[11px] mt-5 tracking-wide">
          © 2026 Luna · All rights reserved
        </p>
      </motion.div>
    </div>
  )
}
