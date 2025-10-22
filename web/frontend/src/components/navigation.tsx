import styled from 'styled-components'
import {
  ArrowTrendingFilled,
  PeopleLinkFilled,
  PeopleSearchFilled,
  PersonCircleRegular,
  PersonWrenchFilled,
  TaskListSquareLtrRegular,
} from '@fluentui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { BackgroundGlass } from '@/assets/styled'
import NavigationRouteComponent from './navigation-route'
import { useAuth } from '@/providers/auth-provider'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

export const NavigationComponent = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const navItems: NavItem[] = [
    { label: 'Akcje', path: '/tools/operations', icon: <ArrowTrendingFilled /> },
    { label: 'Nabory', path: '/tools/recruitment', icon: <PeopleSearchFilled /> },
    { label: 'Rozpiska', path: '/tools/recruitment', icon: <TaskListSquareLtrRegular /> },
    { label: 'Użytkownicy', path: '/tools/users', icon: <PeopleLinkFilled /> },
    { label: 'Ustawienia', path: '/tools/recruitment', icon: <PersonWrenchFilled /> },
  ]

  return (
    <Wrapper>
      <RoutesContainer>
        {navItems.map((item) => (
          <NavigationRouteComponent key={item.label} label={item.label} onClick={() => navigate({ to: item.path })}>
            {item.icon}
          </NavigationRouteComponent>
        ))}
      </RoutesContainer>

      <ProfileContainer>
        <NavigationRouteComponent
          label={user?.user_name ?? 'Użytkownik'}
          onClick={() => navigate({ to: '/tools/profile' })}
        >
          <PersonCircleRegular />
        </NavigationRouteComponent>
      </ProfileContainer>
    </Wrapper>
  )
}

const Wrapper = styled(BackgroundGlass)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50px;
  max-width: 50px;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.5);
  z-index: 1000;
  transition: all 0.2s ease-in;

  &:hover {
    width: 250px;
    max-width: 250px;
  }

  &:hover .nav-label {
    opacity: 1;
    visibility: visible;
  }
`

const RoutesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 100px;
`

const ProfileContainer = styled.div``
