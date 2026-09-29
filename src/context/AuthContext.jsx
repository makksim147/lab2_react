import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

const USERS = [
  { login: 'admin', password: 'admin123', name: 'Администратор' },
  { login: 'user', password: 'user123', name: 'Пользователь' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  function loginUser(login, password) {
    const found = USERS.find(u => u.login === login && u.password === password)
    if (found) {
      const userData = { login: found.login, name: found.name }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    }
    return false
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}