import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, AuthContextType, LoginResponse } from '../types/auth'

const API_URL = 'http://localhost:8000/api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        logout()
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const data: LoginResponse = await response.json()
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('token', data.token)
  }

  const logout = () => {
    if (token) {
      fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      }).catch(console.error)
    }
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
