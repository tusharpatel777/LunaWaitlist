import { useState, useCallback } from 'react'

const SESSION_KEY = 'wl_authenticated'

export function useAuth() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  )

  const login = useCallback((username, password) => {
    const validUser = import.meta.env.VITE_AUTH_USER
    const validPass = import.meta.env.VITE_AUTH_PASS

    if (!validUser || !validPass) {
      // No credentials configured — block access
      return false
    }

    if (username.trim() === validUser && password === validPass) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setAuthed(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthed(false)
  }, [])

  return { authed, login, logout }
}
