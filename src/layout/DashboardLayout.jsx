import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#04040e' }}>

      {/* ── Ambient background orbs — fixed, pointer-events-none ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {/* Top-left violet bloom */}
        <div style={{
          position: 'absolute', top: '-15%', left: '-8%',
          width: '65%', height: '65%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109,40,217,0.14) 0%, rgba(88,28,235,0.06) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        {/* Top-right indigo */}
        <div style={{
          position: 'absolute', top: '-5%', right: '5%',
          width: '40%', height: '45%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }} />
        {/* Bottom-right cyan accent */}
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-5%',
          width: '55%', height: '55%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 65%)',
          filter: 'blur(70px)',
        }} />
        {/* Centre-left purple mid-glow */}
        <div style={{
          position: 'absolute', top: '45%', left: '25%',
          width: '35%', height: '35%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        {/* Very subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* ── Sidebar ── */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={onLogout} />
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0" style={{ position: 'relative', zIndex: 5 }}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
