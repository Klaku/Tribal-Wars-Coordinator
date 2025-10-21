import { useAuth } from '@/providers/auth-provider'
import { useToastContext } from '@/providers/toast-provider'
import type { dtoUser } from '@/types/app.types'
import type { DatabaseRoleAssignment } from '@/types/db.types'
import { Switch } from '@fluentui/react-components'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'

const TableRow = ({ item }: { item: dtoUser }) => {
  const authContext = useAuth()
  const toastContext = useToastContext()
  const { user_email, players, user_id } = item
  const [roles, setRoles] = useState(item.roles)
  const mutation = useMutation({
    mutationFn: (body: DatabaseRoleAssignment) => {
      return axios.post('/api/user/role', body)
    },
    onSuccess: (data, variables, _onMutateResult, context) => {
      context.client.setQueryData(['user/list'], (prev?: dtoUser[]) => {
        if (prev)
          return prev.map((user) => {
            if (user.user_id == variables.user_id) {
              const tmp = [...user.roles, variables].filter(
                (x) =>
                  data.data.result == 'Granted' ||
                  x.role_id != variables.role_id
              )
              setRoles(tmp)
              const t_role = variables.role_id == 1 ? 'Radny' : 'Gracz'
              const t_body =
                data.data.result == 'Granted'
                  ? `Przypisano do roli ${t_role}`
                  : `Usunięto przypisanie do roli ${t_role}`
              toastContext.dispatchSuccess('Success', t_body)
              return {
                ...user,
                roles: tmp,
              }
            }
            return user
          })
      })
    },
    onError: (error, _variables, _onMutateResult, context) => {
      console.error(error)
      toastContext.dispatchError(
        'Wystąpił błąd',
        'Odświeżenie strony powinno naprawić ten temat'
      )
      context.client.cancelQueries({ queryKey: ['user/list'] })
    },
  })

  const handleChange = (role_id: number, user_id: string) => {
    mutation.mutate({
      role_assignment_id: 0,
      role_id: role_id,
      user_id: user_id,
    })
  }
  return (
    <tr>
      <td>{user_email}</td>
      <td>
        <ul>
          {players.map((player) => {
            return (
              <li
                key={player.player_id}
              >{`${player.player_name} ${player.tribe ? `(${player.tribe.tribe_tag})` : ''}`}</li>
            )
          })}
        </ul>
      </td>
      <td>
        <Switch
          disabled={
            mutation.isPending ||
            mutation.isError ||
            authContext.user?.user_id == user_id ||
            !authContext.user?.roles.some((x) => x.role_id == 1)
          }
          defaultChecked={roles.some((x) => x.role_id == 1)}
          onChange={() => {
            handleChange(1, user_id)
          }}
        />
      </td>
      <td>
        <Switch
          disabled={
            mutation.isPending ||
            mutation.isError ||
            !authContext.user?.roles.some((x) => x.role_id == 1)
          }
          defaultChecked={roles.some((x) => x.role_id == 2)}
          onChange={() => {
            handleChange(2, user_id)
          }}
        />
      </td>
    </tr>
  )
}

export default TableRow
