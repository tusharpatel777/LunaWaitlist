import { useState, useRef, useEffect } from 'react'
import { RiArrowDownSLine, RiCheckLine, RiArrowDownLine } from 'react-icons/ri'

export default function CustomSelect({ value, onChange, options = [], placeholder = 'All' }) {
  const [open, setOpen]           = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)
  const ref                       = useRef(null)
  const listRef                   = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // detect if the list is scrollable after opening
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
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all focus:outline-none whitespace-nowrap"
        style={{
          background: open
            ? 'rgba(99,102,241,0.12)'
            : 'rgba(255,255,255,0.04)',
          border: open
            ? '1px solid rgba(99,102,241,0.4)'
            : '1px solid rgba(255,255,255,0.08)',
          color: value ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)',
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <RiArrowDownSLine
          size={15}
          style={{
            color: 'rgba(255,255,255,0.35)',
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute z-50 mt-2 min-w-full w-max max-w-[260px] rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(10, 10, 24, 0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(99,102,241,0.15) inset',
          }}
        >
          {/* Scrollable list */}
          <div
            ref={listRef}
            className="overflow-y-auto py-1.5"
            style={{ maxHeight: '320px' }}
          >
            {/* Clear / All option */}
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false) }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors"
              style={{
                color: !value ? 'rgba(129,140,248,1)' : 'rgba(255,255,255,0.40)',
                background: !value ? 'rgba(99,102,241,0.12)' : 'transparent',
              }}
              onMouseEnter={e => { if (value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (value) e.currentTarget.style.background = 'transparent' }}
            >
              <span className="font-medium">{placeholder}</span>
              {!value && <RiCheckLine size={13} style={{ color: 'rgba(129,140,248,1)', flexShrink: 0 }} />}
            </button>

            {/* Thin divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '2px 12px' }} />

            {/* Options */}
            {options.map(opt => {
              const active = value === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors"
                  style={{
                    color: active ? 'rgba(129,140,248,1)' : 'rgba(255,255,255,0.72)',
                    background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <span>{opt.label}</span>
                  {active && <RiCheckLine size={13} style={{ color: 'rgba(129,140,248,1)', flexShrink: 0 }} />}
                </button>
              )
            })}
          </div>

          {/* Scroll hint — fades out when fully scrolled */}
          {canScrollDown && (
            <div
              className="flex items-center justify-center gap-1 py-1.5"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(10,10,24,0.7)',
              }}
            >
              <RiArrowDownLine size={11} style={{ color: 'rgba(255,255,255,0.25)' }} />
              <span style={{ color: 'rgba(255,255,255,0.20)', fontSize: '10px' }}>scroll for more</span>
              <RiArrowDownLine size={11} style={{ color: 'rgba(255,255,255,0.25)' }} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
