import { StrictMode } from 'react'
import * as AuthProvider from '@/providers/auth-provider'
import * as QueryProvider from '@/providers/query-provider'
import * as FluentProvider from '@/providers/fluent-provider'
import { ToastContextProvider } from '@/providers/toast-provider'
import type { QueryClient } from '@tanstack/react-query'

interface IndexProviderProps {
  children: React.ReactNode
  client: QueryClient
}

export function IndexProvider({ children, client }: IndexProviderProps) {
  return (
    <StrictMode>
      <AuthProvider.Provider client={client}>
        <QueryProvider.Provider client={client}>
          <FluentProvider.Provider>
            <ToastContextProvider>{children}</ToastContextProvider>
          </FluentProvider.Provider>
        </QueryProvider.Provider>
      </AuthProvider.Provider>
    </StrictMode>
  )
}
