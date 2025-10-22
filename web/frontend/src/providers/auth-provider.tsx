import { getUserMeQuery } from '@/queries/getUserQuery'
import type { dtoUser } from '@/types/app.types'
import type { QueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import React, { useCallback, useMemo } from 'react'
import CONSTS from '@/consts'

export interface AuthContext {
  login: () => void
  logout: () => void
  user: dtoUser | null
  isLoading: boolean
  error: AxiosError | null
  refetchUser: () => void
}

interface AuthProviderProps {
  children: React.ReactNode
  client: QueryClient
}

const AuthContext = React.createContext<AuthContext | null>(null)

export function Provider({ children, client }: AuthProviderProps) {
  const login = useCallback(() => {
    window.location.href = CONSTS.AUTH_URLS_LOGIN
  }, [])

  const logout = useCallback(() => {
    window.location.href = CONSTS.AUTH_URLS_LOGOUT
  }, [])

  const { data, isLoading, error, refetch } = useQuery({
    ...getUserMeQuery(),
    queryFn: () => client.fetchQuery(getUserMeQuery()),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const contextValue = useMemo(
    () => ({
      user: data ?? null,
      isLoading,
      error: error instanceof AxiosError ? error : null,
      login,
      logout,
      refetchUser: refetch,
    }),
    [data, isLoading, error, login, logout, refetch],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
