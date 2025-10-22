import type { dtoUser } from '@/types/app.types'
import { queryOptions } from '@tanstack/react-query'
import axios from 'axios'

export const getUserMeQuery = () =>
  queryOptions({
    queryKey: ['user/me'],
    queryFn: async () => {
      const { data } = await axios.get<dtoUser>('/api/user/me', {
        withCredentials: true,
      })
      return data
    },
    staleTime: 1000 * 60 * 10, // 10 min
  })

export const getUserListQuery = () =>
  queryOptions({
    queryKey: ['user/list'],
    queryFn: async () => {
      const { data } = await axios.get<dtoUser[]>('/api/user/list', {
        withCredentials: true,
      })
      return data
    },
    staleTime: 1000 * 60 * 10, // 10 min
  })
