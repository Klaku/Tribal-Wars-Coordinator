import LoginComponent from '@/components/login'
import { useAuth } from '@/providers/auth-provider'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import styled from 'styled-components'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { user } = useAuth()
  const navigate = useNavigate({ from: '/' })

  useEffect(() => {
    if (user) {
      navigate({ to: '/tools/operations' })
    }
  }, [user, navigate])

  return <Wrapper>{user ? <Outlet /> : <LoginComponent />}</Wrapper>
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`
