import { getUserMeQuery } from '@/queries/getUserQuery'
import type { dtoUser } from '@/types/app.types'
import type { QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import * as React from 'react'

export interface AuthContext {
  login: () => void
  logout: () => void
  user: dtoUser | null
  isLoading: boolean
  error: AxiosError | null
}

interface AuthProviderProps {
  children: React.ReactNode
  client: QueryClient
}

const AuthContext = React.createContext<AuthContext | null>(null)

export function Provider({ children, client }: AuthProviderProps) {
  const [user, setUser] = React.useState<dtoUser | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<AxiosError | null>(null)
  const logout = React.useCallback(async () => {
    window.location.href = 'http://localhost:8000/api/auth/logout'
  }, [])

  const login = React.useCallback(async () => {
    window.location.href = 'http://localhost:8000/api/auth/google'
  }, [])

  const verify = async () => {
    setIsLoading(true)
    const timestamp = Date.now()
    try {
      const value = await client.fetchQuery(getUserMeQuery())
      setTimeout(
        () => {
          setUser(value)
          setIsLoading(false)
        },
        Math.min(1000 - (Date.now() - timestamp), 1000)
      )
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err)
      }
      setUser(null)
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    verify()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
