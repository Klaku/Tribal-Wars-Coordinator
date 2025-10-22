import { tokens } from '@fluentui/react-components'
import styled from 'styled-components'
import React from 'react'

interface NavigationRouteProps {
  label: string
  children: React.ReactNode
  onClick: () => void
}

const NavigationRouteComponent: React.FC<NavigationRouteProps> = ({ label, children, onClick }) => {
  return (
    <RouteWrapper onClick={onClick}>
      <NavIcon>{children}</NavIcon>
      <NavLabel>{label}</NavLabel>
    </RouteWrapper>
  )
}

export default NavigationRouteComponent

const RouteWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  transition: background 0.2s ease-in;
  border-bottom: 1px solid ${tokens.colorNeutralStroke1};
  &:hover {
    background: ${tokens.colorNeutralBackgroundInverted};
    cursor: pointer;
    div:last-child {
      opacity: 1;
      visibility: visible;
    }
  }
`

const NavIcon = styled.div`
  width: 50px;
  min-width: 50px;
  font-size: 24px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`

const NavLabel = styled.div`
  opacity: 0;
  visibility: hidden;
  margin-left: 8px;
  transition: opacity 0.2s ease-in;
  white-space: nowrap;
  font-weight: 500;
`
