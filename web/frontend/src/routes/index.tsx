import LoginComponent from '@/components/login'
import { useAuth } from '@/providers/auth-provider'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import styled from 'styled-components'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const context = useAuth()
  const navigate = useNavigate({ from: '/' })
  function Layout() {
    if (context.user != null) {
      navigate({ to: '/tools/operations' })
      return <Outlet />
    }
    return <LoginComponent />
  }

  return (
    <Wrapper>
      <Layout />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`
