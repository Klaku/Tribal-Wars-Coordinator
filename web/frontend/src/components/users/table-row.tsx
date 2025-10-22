import { useAuth } from '@/providers/auth-provider'
import { useToastContext } from '@/providers/toast-provider'
import type { dtoUser } from '@/types/app.types'
import type { DatabaseRoleAssignment } from '@/types/db.types'
import { Switch } from '@fluentui/react-components'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState, useMemo } from 'react'

interface TableRowProps {
  item: dtoUser
}

const ROLE_NAMES: Record<number, string> = {
  1: 'Radny',
  2: 'Gracz',
}

const TableRow: React.FC<TableRowProps> = ({ item }) => {
  const { user_email, players, user_id } = item
  const [roles, setRoles] = useState(item.roles)

  const authContext = useAuth()
  const toastContext = useToastContext()
  const queryClient = useQueryClient()

  const isAdmin = useMemo(() => authContext.user?.roles.some((x) => x.role_id === 1), [authContext.user])

  const mutation = useMutation({
    mutationFn: (body: DatabaseRoleAssignment) => axios.post('/api/user/role', body),
    onSuccess: (response, variables) => {
      const granted = response.data.result === 'Granted'
      queryClient.setQueryData<dtoUser[]>(['user/list'], (prev) =>
        prev?.map((user) => {
          if (user.user_id !== variables.user_id) return user

          const updatedRoles = [...user.roles].filter((r) => granted || r.role_id !== variables.role_id)
          if (granted) updatedRoles.push(variables)
          setRoles(updatedRoles)

          // Show toast
          toastContext.dispatchSuccess(
            'Success',
            granted
              ? `Przypisano do roli ${ROLE_NAMES[variables.role_id]}`
              : `Usunięto przypisanie do roli ${ROLE_NAMES[variables.role_id]}`,
          )

          return { ...user, roles: updatedRoles }
        }),
      )
    },
    onError: (error) => {
      console.error(error)
      toastContext.dispatchError('Wystąpił błąd', 'Odświeżenie strony powinno naprawić ten temat')
      queryClient.invalidateQueries({ queryKey: ['user/list'] })
    },
  })

  const handleRoleChange = (role_id: number) => {
    mutation.mutate({
      role_assignment_id: 0,
      role_id,
      user_id,
    })
  }

  const isSwitchDisabled = (role_id: number) => {
    if (!isAdmin) return true
    if (authContext.user?.user_id === user_id && role_id === 1) return true
    return mutation.isPending || mutation.isError
  }

  return (
    <tr>
      <td>{user_email}</td>
      <td>
        <ul>
          {players.map((player) => (
            <li key={player.player_id}>
              {player.player_name} {player.tribe ? `(${player.tribe.tribe_tag})` : ''}
            </li>
          ))}
        </ul>
      </td>
      {[1, 2].map((roleId) => (
        <td key={roleId}>
          <Switch
            disabled={isSwitchDisabled(roleId)}
            defaultChecked={roles.some((x) => x.role_id === roleId)}
            onChange={() => handleRoleChange(roleId)}
          />
        </td>
      ))}
    </tr>
  )
}

export default TableRow
