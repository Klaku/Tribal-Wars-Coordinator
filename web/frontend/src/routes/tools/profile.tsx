import { PageWrapper } from '@/assets/styled'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tools/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PageWrapper>Profile</PageWrapper>
}
