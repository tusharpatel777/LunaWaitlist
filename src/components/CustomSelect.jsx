import { useState, useRef, useEffect } from 'react'
import { RiArrowDownSLine, RiCheckLine, RiArrowDownLine } from 'react-icons/ri'

export default function CustomSelect({ value, onChange, options = [], placeholder = 'All' }) {
  const [open, setOpen]             = useState(false)
  const [alignRight, setAlignRight] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)
  const rootRef  = useRef(null)
  const listRef  = useRef(null)

  // Close on outside click
  useEffect(() => {
    function onDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // Decide whether to open left or right
  useEffect(() => {
    if (!open || !rootRef.current) return
    const rect = rootRef.current.getBoundingClientRect()
    setAlignRight(rect.left > window.innerWidth * 0.55)
  }, [open])

  // Track scroll depth to show "more below" hint
  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current
    const check = () => setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 4)
    check()
    el.addEventListener('scroll', check)
    return () => el.removeEventListener('scroll', check)
  }, [open, options])

  const selected = options.find(o => o.value === value)

  return (
    <div ref={rootRef} className="relative">
      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all focus:outline-none whitespace-nowrap"
        style={{
          background: open ? 'rgba(99,102,241,0.14)' : 'rgba(255,255,255,0.04)',
          border:     open ? '1px solid rgba(99,102,241,0.45)' : '1px solid rgba(255,255,255,0.08)',
          color:      value ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.42)',
          boxShadow:  open ? '0 0 0 3px rgba(99,102,241,0.08)' : 'none',
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <RiArrowDownSLine
          size={15}
          style={{
            color: 'rgba(255,255,255,0.30)',
            flexShrink: 0,
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div
          className={`absolute z-50 mt-2 min-w-full w-max max-w-[260px] rounded-2xl overflow-hidden ${alignRight ? 'right-0' : 'left-0'}`}
          style={{
            background:           'rgba(8, 8, 22, 0.88)',
            backdropFilter:       'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border:               '1px solid rgba(255,255,255,0.10)',
            boxShadow:
              '0 24px 64px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.06) inset, 0 0 0 0.5px rgba(99,102,241,0.12) inset',
          }}
        >
          {/* Scrollable list */}
          <div ref={listRef} className="overflow-y-auto py-1.5" style={{ maxHeight: '320px' }}>
            {/* Placeholder / clear option */}
            <DropItem
              label={placeholder}
              active={!value}
              onClick={() => { onChange(''); setOpen(false) }}
            />

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '2px 10px' }} />

            {options.map(opt => (
              <DropItem
                key={opt.value}
                label={opt.label}
                active={value === opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
              />
            ))}
          </div>

          {/* Scroll hint */}
          {canScrollDown && (
            <div
              className="flex items-center justify-center gap-1 py-1.5"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(8,8,22,0.8)',
              }}
            >
              <RiArrowDownLine size={10} style={{ color: 'rgba(255,255,255,0.22)' }} />
              <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '10px' }}>scroll for more</span>
              <RiArrowDownLine size={10} style={{ color: 'rgba(255,255,255,0.22)' }} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DropItem({ label, active, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors"
      style={{
        color:      active ? 'rgba(165,180,252,1)' : 'rgba(255,255,255,0.70)',
        background: active ? 'rgba(99,102,241,0.14)' : hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
      }}
    >
      <span>{label}</span>
      {active && <RiCheckLine size={13} style={{ color: 'rgba(165,180,252,1)', flexShrink: 0 }} />}
    </button>
  )
}
