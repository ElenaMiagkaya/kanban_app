import { useQuery } from '@tanstack/react-query'
import { getProjects } from './getProjects'
import { projectKeys } from './projectKeys'
import type { ProjectListItem } from '../model/types'
import { useAuth } from '@shared/lib'

export const useProjects = () => {
  const auth = useAuth()

  const query = useQuery<ProjectListItem[], Error>({
    queryKey: projectKeys.list(auth.user?.id ?? ''),
    queryFn: () => getProjects(auth.user?.id ?? ''),
    enabled: !auth.isLoading && auth.isAuth && Boolean(auth.user?.id), //enabled: true - это значит, что запрос будет выполнен, если условие истинно
    staleTime: 1000 * 60 * 60, // 1 час
    gcTime: 1000 * 60 * 60 * 24, // 24 часа
  })
  return { ...query, isLoading: auth.isLoading, user: auth.user } //возвращаем query, который содержит данные, ошибку, статус запроса и другие свойства
}
