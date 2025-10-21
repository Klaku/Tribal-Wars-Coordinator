import { PageWrapper, Tbody, Thead } from '@/assets/styled'
import TableRow from '@/components/users/table-row'
import { getUserListQuery } from '@/queries/getUserQuery'
import type { dtoUser } from '@/types/app.types'
import { Table, Text } from '@fluentui/react-components'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'
export const Route = createFileRoute('/tools/users')({
  component: RouteComponent,
  loader: ({ context }) => {
    return context.client.fetchQuery(getUserListQuery())
  },
})

function RouteComponent() {
  const data = useLoaderData({ from: '/tools/users' })

  const TableHeader = () => {
    return (
      <Thead>
        <tr>
          <td>
            <Text weight="medium">Konto</Text>
          </td>
          <td>
            <Text weight="medium">Gracze</Text>
          </td>
          <td>
            <Text weight="medium">Radny</Text>
          </td>
          <td>
            <Text weight="medium">Gracz</Text>
          </td>
        </tr>
      </Thead>
    )
  }

  const sortFn = (a: dtoUser, b: dtoUser) => {
    let aadmin = a.roles.some((x) => x.role_id == 1)
    let badmin = b.roles.some((x) => x.role_id == 1)

    if (aadmin && !badmin) return -1
    if (badmin && !aadmin) return 1

    let amember = a.roles.some((x) => x.role_id == 2)
    let bmember = b.roles.some((x) => x.role_id == 2)

    if (amember && !bmember) return -1
    if (!amember && bmember) return 1

    return a.user_email.localeCompare(b.user_email)
  }

  return (
    <PageWrapper>
      <Table>
        <TableHeader />
        <Tbody>
          {data.sort(sortFn).map((dtoUser) => {
            return <TableRow key={dtoUser.user_id} item={dtoUser} />
          })}
        </Tbody>
      </Table>
    </PageWrapper>
  )
}
