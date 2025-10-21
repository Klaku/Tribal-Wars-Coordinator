import LoginComponent from '@/components/login'
import { NavigationComponent } from '@/components/navigation'
import { useAuth } from '@/providers/auth-provider'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import styled from 'styled-components'

export const Route = createFileRoute('/tools')({
  component: RouteComponent,
})

function RouteComponent() {
  const context = useAuth()
  if (context.user == null)
    return (
      <CenteredWrapper>
        <LoginComponent />
      </CenteredWrapper>
    )
  return (
    <>
      <NavigationComponent />
      <Wrapper>
        <Outlet />
      </Wrapper>
    </>
  )
}
const CenteredWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const Wrapper = styled.div`
  position: relative;
  margin-left: 60px;
  padding: 10px;
  box-sizing: border-box;
`
