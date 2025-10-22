import { PageWrapper, Tbody } from '@/assets/styled'
import { TableHeader } from '@/components/users/table-header'
import TableRow from '@/components/users/table-row'
import { getUserListQuery } from '@/queries/getUserQuery'
import type { dtoUser } from '@/types/app.types'
import { Table } from '@fluentui/react-components'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/tools/users')({
  component: RouteComponent,
  loader: ({ context }) => {
    return context.client.fetchQuery(getUserListQuery())
  },
})

function RouteComponent() {
  const data = useLoaderData({ from: '/tools/users' })

  return (
    <PageWrapper>
      <Table>
        <TableHeader />
        <Tbody>
          {data.sort(sortFn).map((user) => (
            <TableRow key={user.user_id} item={user} />
          ))}
        </Tbody>
      </Table>
    </PageWrapper>
  )
}

const sortFn = (a: dtoUser, b: dtoUser) => {
  const aIsAdmin = a.roles.some((role) => role.role_id === 1)
  const bIsAdmin = b.roles.some((role) => role.role_id === 1)

  if (aIsAdmin && !bIsAdmin) return -1
  if (bIsAdmin && !aIsAdmin) return 1

  const aIsMember = a.roles.some((role) => role.role_id === 2)
  const bIsMember = b.roles.some((role) => role.role_id === 2)

  if (aIsMember && !bIsMember) return -1
  if (!aIsMember && bIsMember) return 1

  return a.user_email.localeCompare(b.user_email)
}
