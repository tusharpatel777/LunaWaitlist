import { useEffect, useRef } from 'react'
import { animate } from 'framer-motion'

export default function AnimatedCounter({ value, decimals = 0 }) {
  const ref  = useRef(null)
  const prev = useRef(0)

  useEffect(() => {
    if (!ref.current) return
    const from = prev.current
    const ctrl = animate(from, value, {
      duration: 0.85,
      ease: 'easeOut',
      onUpdate(v) {
        if (!ref.current) return
        ref.current.textContent = decimals > 0
          ? v.toFixed(decimals)
          : Math.round(v).toLocaleString()
      },
    })
    prev.current = value
    return () => ctrl.stop()
  }, [value, decimals])

  return (
    <span ref={ref}>
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()}
    </span>
  )
}
