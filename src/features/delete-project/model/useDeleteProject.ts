import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProjectById } from '@shared/api'
import { projectKeys } from '@/entities/project'
import { useAuth } from '@shared/lib'

export const useDeleteProject = (projectId: string, onSuccess?: () => void) => {
  const auth = useAuth()

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationKey: ['project', 'delete', projectId],
    mutationFn: async () => {
      const ownerId = auth.user?.id
      if (!ownerId) throw new Error('Пользователь не найден')
      await deleteProjectById(projectId)
      return ownerId //возвращаем ownerId для использования в onSuccess
    },
    onSuccess: (ownerId) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) }) //удаляем проект из queryClient
      queryClient.invalidateQueries({ queryKey: projectKeys.list(ownerId) }) //обновляем список проектов
      onSuccess?.() //вызываем callback, если он передан
    },
  })
  return mutation
}
