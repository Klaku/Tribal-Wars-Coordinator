import { Thead } from '@/assets/styled'
import { Text } from '@fluentui/react-components'
export const TableHeader = () => {
  return (
    <Thead>
      <tr>
        <td>
          <Text weight='medium'>Konto</Text>
        </td>
        <td>
          <Text weight='medium'>Gracze</Text>
        </td>
        <td>
          <Text weight='medium'>Radny</Text>
        </td>
        <td>
          <Text weight='medium'>Gracz</Text>
        </td>
      </tr>
    </Thead>
  )
}
