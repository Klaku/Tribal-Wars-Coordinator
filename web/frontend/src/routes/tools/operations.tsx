import { PageWrapper } from '@/assets/styled'
import { createFileRoute } from '@tanstack/react-router'
import MarkdownComponent from 'react-markdown'
export const Route = createFileRoute('/tools/operations')({
  component: OperationsPage,
})

function OperationsPage() {
  return (
    <PageWrapper>
      <MarkdownComponent>
        {`
          - Lista Operacji 
          - Operacja tworzona jest po zamknięciu markdown 
          - Do Operacji uprawnienia ma tylko "management" 
          - Do operacji podlinkowana jest rozpiska 
          - Widać wszystkie ataki idące
          - W tym paneli jest New Form dla Operacji -> Tworzy Nabór automatycznie
        `}
      </MarkdownComponent>
    </PageWrapper>
  )
}
