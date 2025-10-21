import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { routeTree } from './routeTree.gen'
import * as QueryProvider from './providers/query-provider'
import * as FluentProvider from './providers/fluent-provider'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import * as AuthProvider from './providers/auth-provider'
import './assets/styles.css'
import { ToastContextProvider } from './providers/toast-provider'

const QueryProviderContext = QueryProvider.getContext()

const router = createRouter({
  routeTree,
  context: {
    ...QueryProviderContext,
  },
  defaultStructuralSharing: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AuthProvider.Provider client={QueryProviderContext.client}>
        <QueryProvider.Provider client={QueryProviderContext.client}>
          <FluentProvider.Provider>
            <ToastContextProvider>
              <RouterProvider
                router={router}
                context={{ ...QueryProviderContext }}
              />
            </ToastContextProvider>
          </FluentProvider.Provider>
        </QueryProvider.Provider>
      </AuthProvider.Provider>
    </StrictMode>
  )
}
