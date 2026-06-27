import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../types'
import * as mockService from '../services/mockData'

interface AuthContextType {
  currentUser: User | null
  login: (username: string, password: string) => Promise<User | null>
  logout: () => void
  refreshUser: () => void
  isParent: boolean
  isChild: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = mockService.getCurrentUser()
    setCurrentUser(user)
    setLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<User | null> => {
    const user = mockService.login(username, password)
    setCurrentUser(user)
    return user
  }

  const logout = () => {
    mockService.logout()
    setCurrentUser(null)
  }

  const refreshUser = () => {
    const user = mockService.getCurrentUser()
    setCurrentUser(user)
  }

  const isParent = currentUser?.role === 'parent'
  const isChild = currentUser?.role === 'child'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-primary-500 animate-bounce">🌟 加载中...</div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, refreshUser, isParent, isChild }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
