import { createContext, useContext } from 'react'
import { useWaitlistData } from '../hooks/useWaitlistData'

const WaitlistContext = createContext(null)

export function WaitlistProvider({ children }) {
  const value = useWaitlistData()
  return <WaitlistContext.Provider value={value}>{children}</WaitlistContext.Provider>
}

export function useWaitlist() {
  const ctx = useContext(WaitlistContext)
  if (!ctx) throw new Error('useWaitlist must be used inside <WaitlistProvider>')
  return ctx
}
