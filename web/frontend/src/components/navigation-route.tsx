import { tokens } from '@fluentui/react-components'
import styled from 'styled-components'

const NavigationRouteComponent = ({
  label,
  children,
  onClick,
}: React.PropsWithChildren<{ label: string; onClick: () => void }>) => {
  return (
    <RouteWrapper onClick={onClick}>
      <NavIcon>{children}</NavIcon>
      <NavLabel className="nav-label">{label}</NavLabel>
    </RouteWrapper>
  )
}

export default NavigationRouteComponent

const RouteWrapper = styled.div`
  display: flex;
  height: 50px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  transition: all 0.2s ease-in;
  border-bottom: 1px solid ${tokens.colorNeutralStroke1};
  &:hover {
    background: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
`
const NavIcon = styled.div`
  width: 50px;
  min-width: 50px;
  font-size: 24px;
  text-align: center;
  padding: 0 10px;
  box-sizing: border-box;
`

const NavLabel = styled.div`
  opacity: 0;
  visibility: hidden;
  transition-delay: 0.2s;
  transition-property: opacity;
  max-height: 50px;
`
