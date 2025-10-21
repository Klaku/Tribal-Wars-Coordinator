import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { AppBody } from '@/assets/styled'

interface MyRouterContext {
  client: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <AppBody>
      <Outlet />
    </AppBody>
  ),
})
