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

export const NavigationComponent = () => {
  const navigate = useNavigate()
  const context = useAuth()
  return (
    <Wrapper>
      <RoutesContainer>
        <NavigationRouteComponent
          label={'Akcje'}
          onClick={() => navigate({ to: '/tools/operations' })}
        >
          <ArrowTrendingFilled />
        </NavigationRouteComponent>
        <NavigationRouteComponent
          label={'Nabory'}
          onClick={() => navigate({ to: '/tools/recruitment' })}
        >
          <PeopleSearchFilled />
        </NavigationRouteComponent>
        <NavigationRouteComponent
          label={'Rozpiska'}
          onClick={() => navigate({ to: '/tools/recruitment' })}
        >
          <TaskListSquareLtrRegular />
        </NavigationRouteComponent>
        <NavigationRouteComponent
          label={'Użytkownicy'}
          onClick={() => navigate({ to: '/tools/users' })}
        >
          <PeopleLinkFilled />
        </NavigationRouteComponent>
        <NavigationRouteComponent
          label={'Ustawienia'}
          onClick={() => navigate({ to: '/tools/recruitment' })}
        >
          <PersonWrenchFilled />
        </NavigationRouteComponent>
      </RoutesContainer>
      <ProfileContainer>
        <NavigationRouteComponent
          label={context.user?.user_name || 'Użytkownik'}
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
  border: none;
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
