import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { routeTree } from '@/routeTree.gen'
import * as QueryProvider from '@/providers/query-provider'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { IndexProvider } from '@/providers/index-provider'
import '@/assets/styles.css'

const queryContext = QueryProvider.getContext()

const router = createRouter({
  routeTree,
  context: queryContext,
  defaultStructuralSharing: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <IndexProvider client={queryContext.client}>
      <RouterProvider router={router} context={queryContext} />
    </IndexProvider>
  )
}

const rootElement = document.getElementById('app')
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
