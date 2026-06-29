import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProject, type CreateProjectInput, projectKeys } from '@/entities/project'
import { useAuth } from '@shared/lib'
import type { ProjectListItem } from '@/entities/project/model/types'

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  const auth = useAuth()

  const mutation = useMutation<ProjectListItem, Error, CreateProjectInput>({
    mutationKey: ['project', 'create'],
    mutationFn: async (input: CreateProjectInput) => {
      const ownerId = auth.user?.id
      if (!ownerId) throw new Error('Пользователь не найден')
      return createProject(input, ownerId)
    },
    onSuccess: () => {
      const ownerId = auth.user?.id
      if (!ownerId) return
      queryClient.invalidateQueries({ queryKey: projectKeys.list(ownerId) })
    },
  })
  return mutation
}
