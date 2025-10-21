import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface IQueryProviderProps {
  children: React.ReactNode
  client: QueryClient
}

export function getContext() {
  const client = new QueryClient()
  return { client }
}

export function Provider({ children, client }: IQueryProviderProps) {
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools></ReactQueryDevtools>
    </QueryClientProvider>
  )
}
