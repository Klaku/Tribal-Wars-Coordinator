import { PageWrapper } from '@/assets/styled'
import { createFileRoute } from '@tanstack/react-router'
import MarkdownComponent from 'react-markdown'
export const Route = createFileRoute('/tools/recruitment')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageWrapper>
      <MarkdownComponent>
        {`Tutaj gracze widzą czego dotyczy akcja `}
      </MarkdownComponent>
    </PageWrapper>
  )
}
